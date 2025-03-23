from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import io
import os
import pandas as pd
import matplotlib.pyplot as plt
from langchain_openai import ChatOpenAI
from langchain_experimental.utilities import PythonREPL
from typing import Annotated
from langchain_core.tools import tool
from langchain_core.prompts import PromptTemplate
from langchain.agents import AgentExecutor, create_react_agent
from langchain.agents.agent import AgentFinish
from dotenv import load_dotenv
import uuid
import re

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Chart Generation API")

# Standard REPL
repl = PythonREPL()

# Set up a directory for saving images
IMAGES_DIR = "generated_plots"
os.makedirs(IMAGES_DIR, exist_ok=True)

# Function to extract metadata from dataframe
def extract_metadata(df):
    metadata = {}
    metadata['Number of Columns'] = df.shape[1]
    metadata['Schema'] = df.columns.tolist()
    metadata['Data Types'] = str(df.dtypes)
    metadata['Sample'] = df.head(1).to_dict(orient="records")
    return metadata

# Custom AgentExecutor that stops when a plot is generated

class PlotGenerationAgentExecutor(AgentExecutor):
    def _take_next_step(
        self,
        name_to_tool_map,
        color_mapping,
        inputs,
        intermediate_steps,
        run_manager=None
    ):
        """Override to check for plot generation after each step."""
        
        # Take the next step using the parent method
        next_step_output = super()._take_next_step(name_to_tool_map, color_mapping, inputs, intermediate_steps, run_manager)

        # Extract the code containing Matplotlib commands
        if isinstance(next_step_output, tuple) and not isinstance(next_step_output[0], AgentFinish):
            agent_response = next_step_output[0]
            
            # Use regex to extract Python code blocks
            code_match = re.search(r"```python\n(.*?)\n```", agent_response.return_values["output"], re.DOTALL)
            if code_match:
                extracted_code = code_match.group(1)
                
                # Check if the extracted code contains Matplotlib plotting commands
                if "plt." in extracted_code or "matplotlib" in extracted_code:
                    print(f"Extracted Code:\n{extracted_code}")
                    
                    # Run the extracted code
                    plot_path = self._execute_and_save_plot(extracted_code)
                    
                    # Modify agent response to include saved path
                    agent_response.return_values["output"] += f"\n\nPlot saved at: {plot_path}"
                    
                    # Force agent to finish early
                    agent_finish = AgentFinish(
                        return_values={"output": f"Successfully generated and saved the plot at {plot_path}."},
                        log="Plot was generated, ending the agent execution chain."
                    )
                    return agent_finish, next_step_output[1]
        
        return next_step_output
    
    def _execute_and_save_plot(self, code):
        """Executes extracted Python code and saves the generated plot in imagefolder/."""
        try:
            # Store the current figure count
            initial_figures = plt.get_fignums()
            
            # Run the extracted code
            exec(code, repl.globals)

            # Check if a new figure was created
            current_figures = plt.get_fignums()
            new_figures = set(current_figures) - set(initial_figures)

            if new_figures:
                # Get the last created figure
                last_figure = plt.figure(max(new_figures))

                # Define save path
                image_dir = "imagefolder"
                os.makedirs(image_dir, exist_ok=True)
                filename = f"plot_{uuid.uuid4().hex[:8]}.png"
                filepath = os.path.join(image_dir, filename)

                # Save the plot
                last_figure.savefig(filepath, format='png', bbox_inches='tight')
                plt.show()

                return filepath
            else:
                return "No plot was generated."

        except Exception as e:
            return f"Error executing code: {repr(e)}"
# Tool for executing Python code and capturing plots
@tool
def python_repl_with_plotting(
    code: Annotated[str, "The python code to execute to generate your chart."]
):
    """Execute python code and capture any generated plots."""
    try:
        # Store the current figure count
        initial_figures = plt.get_fignums()
        
        # Run the code
        result = repl.run(code)
        
        # Check if new figures were created
        current_figures = plt.get_fignums()
        new_figures = set(current_figures) - set(initial_figures)
        
        if new_figures:
            # Get the last created figure
            last_figure = plt.figure(max(new_figures))
            
            # Generate a unique filename
            filename = f"plot_{uuid.uuid4().hex[:8]}.png"
            filepath = os.path.join(IMAGES_DIR, filename)
            
            # Save the figure to a file
            last_figure.savefig(filepath, format='png', bbox_inches='tight')
            
            # Save the image bytes for API return
            img_buffer = io.BytesIO()
            last_figure.savefig(img_buffer, format='png', bbox_inches='tight')
            img_buffer.seek(0)
            repl.globals['_last_plot_bytes'] = img_buffer.getvalue()
            
            # Set flag that a plot was generated and save the path
            repl.globals['_plot_generated'] = True
            repl.globals['_plot_path'] = filepath
            
            # Display the plot
            plt.show()
            
            return f"Successfully executed code and generated plot:\n```python\n{code}\n```\nStdout: {result}\nPlot was displayed and saved to {filepath}."
        else:
            return f"Successfully executed:\n```python\n{code}\n```\nStdout: {result}\nNo plot was generated."
    except BaseException as e:
        return f"Failed to execute. Error: {repr(e)}"

# Define the tools
tools = [python_repl_with_plotting]

# Agent instructions template
instructions_template = '''
You are an agent that writes and executes Python code to create visualizations.

You have access to a Python REPL with plotting capabilities, which you can use to execute Python code.

You must write the Python code assuming that the dataframe (stored as df) has already been read.

Always include proper visualization elements in your plots:
- Title for the chart
- Labels for axes
- Legend if necessary
- Appropriate colors and styling

If you get an error, debug your code and try again.

IMPORTANT: Your primary task is to generate a visual chart. Make sure your code produces a matplotlib plot.

For any chart you create, include code that calls plt.tight_layout() and ensure the figure size is appropriate (e.g., plt.figure(figsize=(10, 6))).

If the request is for a specific chart type, make sure to use that chart type.

Use plt.show() at the end of your plotting code to display the chart.

Once you successfully generate a plot, your task is complete.
'''

# Agent prompt template
base_template = '''
{instructions_template}

TOOLS:

------

You have access to the following tools:

{tools}

To use a tool, please use the following format:

```
Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
```

When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:

```
Thought: Do I need to use a tool? No
Final Answer: [your response here]
```

Begin!

Previous conversation history:
{chat_history}

New input: {input}
{agent_scratchpad}
'''

# Create the prompt template
base_prompt = PromptTemplate(template=base_template, input_variables=['agent_scratchpad', 'input', 'chat_history', 'tools', 'tool_names'])
base_prompt = base_prompt.partial(instructions_template=instructions_template)

# Initialize LLM
key = os.getenv('OPENAI_API_KEY')
llm = ChatOpenAI(
    openai_api_base="http://192.168.4.46:1234/v1",
    openai_api_key=key,
    model_name="meta-llama-3.1-8b-instruct"
)

# Create the agent
agent = create_react_agent(llm, tools, base_prompt)

# Initialize the REPL globals
repl.globals['df'] = None  # Will be set when dataset is loaded
repl.globals['plt'] = plt
repl.globals['_last_plot_bytes'] = None
repl.globals['_plot_generated'] = False
repl.globals['_plot_path'] = None

# Load the dataset once when the API starts
df = pd.read_csv("mtcars.csv")
# Make dataframe available to the REPL
repl.globals['df'] = df
# Get metadata
metadata = extract_metadata(df)

# Create the custom agent executor
agent_executor = PlotGenerationAgentExecutor(agent=agent, tools=tools, verbose=True)

# Pydantic model for request
class ChartRequest(BaseModel):
    question: str

@app.post("/generate-chart")
async def generate_chart(request: ChartRequest):
    # Prepare the input with schema information
    input_with_schema = f"""
    {request.question}
    
    Here is the dataset schema:
    {metadata['Schema']}
    """
    
    # Execute the agent
    try:
        agent_output = agent_executor.invoke({
            "input": input_with_schema,
            "chat_history": ""
        })
        
        # Check if a plot was generated and saved
        if repl.globals['_last_plot_bytes'] is not None:
            image_bytes = repl.globals['_last_plot_bytes']
            # Reset the global variable
            repl.globals['_last_plot_bytes'] = None
            # Return the image as PNG
            return Response(content=image_bytes, media_type="image/png")
        else:
            # Return the text output if no plot was generated
            return JSONResponse(content={"message": agent_output["output"]}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Simple status endpoint
@app.get("/")
async def status():
    return {"status": "running", "available_columns": metadata['Schema']}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)