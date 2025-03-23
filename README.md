# ClaimBeaver: Insurance Claims Processing Chatbot

ClaimBeaver is an intelligent chatbot designed to streamline insurance claims processing, providing users with a seamless and efficient experience.

## Project Structure

The project is organized into the following main directories:

- `Conversational_Workflow_Map/`: Contains JSON files that define the conversational workflows for the chatbot.
- `Frontend/`: Contains the frontend code for the web application, built with Next.js.
- `generated_plots/`: Stores generated plot images.
- `Landing_Page/`: Contains the landing page code for the web application, built with Next.js.
- `LLM_Microservices/`: Contains microservices for handling various tasks related to the chatbot, including database interactions and language model integrations.
- `Voice_Agent/`: Contains the FastAPI-based backend for the voice agent, which handles user interactions and processes claims.

## Folder Details

### Conversational_Workflow_Map/
- `Claims.json`: Defines the conversational flow for handling claims, including questions and responses.

### Frontend/
- Contains the source code for the frontend, including components and pages.

### generated_plots/
- Stores generated plot images, such as `plot_8c9ab8af.png`.

### Landing_Page/
- Contains the source code for the landing page, including components and pages.

### LLM_Microservices/
- `chains.py`: Defines the chains for processing queries and generating responses.
- `Claim_Processor.ipynb`: Jupyter notebook for processing claims.
- `config.py`: Configuration file for database connections.
- `database.py`: Contains functions for interacting with the database.
- `JSON_to_Text.py`: Converts JSON data to text responses.
- `llm.py`: Initializes and configures language models.
- `main_api.py`: FastAPI application for handling API requests.
- `parser.py`: Parses SQL queries from language model responses.
- `prompts.py`: Defines prompt templates for generating SQL queries and responses.
- `requirements.txt`: Lists dependencies for the microservices.
- `schema.txt`: Contains the database schema.

### Voice_Agent/
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `main.py`: FastAPI application for handling voice agent interactions.
- `requirements.txt`: Lists dependencies for the voice agent.
- `services/`: Contains utility functions and services used by the voice agent.
  - `database.py`: Functions for database interactions.
  - `logging.py`: Configures logging for the application.
- `api/routes/`: Contains the API route definitions for the voice agent.
  - `user_routes.py`: Defines routes for user-related operations, such as creating and retrieving user data.

## How the System Works

1. **Frontend**: The frontend is built with Next.js and provides a user interface for interacting with the chatbot. Users can submit claims and view their status through the web application.

2. **Voice Agent**: The voice agent is built with FastAPI and handles user interactions via voice. It processes claims and provides responses based on the conversational workflow defined in `Conversational_Workflow_Map/Claims.json`. The voice agent uses Retell to handle language localization and SIP to redirect the call to the LLM model. The LLM model breaks the voice into chunks, analyzes them, checks the language, and returns the response based on the conversational workflow map.

3. **LLM Microservices**: The microservices handle various tasks related to the chatbot, including:
   - Generating SQL queries based on user questions.
   - Interacting with the database to retrieve and update claim information.
   - Converting JSON data to natural language responses.
   - Integrating with language models to generate responses.

4. **Conversational Workflow**: The conversational workflow is defined in `Conversational_Workflow_Map/Claims.json`, which specifies the flow of questions and responses for handling claims.

5. **Generated Plots**: The system can generate plots based on claim data, which are stored in the `generated_plots/` directory.

## How the Code Works

1. **Frontend**: The frontend code in the `src/` directory includes React components and pages that define the user interface. It interacts with the backend via API calls to submit claims and retrieve claim status.

2. **Voice Agent**: The `main.py` file in the `Voice_Agent/` directory defines the FastAPI application. It includes endpoints for handling voice interactions, processing claims, and generating responses based on the conversational workflow. The voice agent uses Retell to handle language localization and SIP to redirect the call to the LLM model. The LLM model breaks the voice into chunks, analyzes them, checks the language, and returns the response based on the conversational workflow map. The `services/` folder contains utility functions and services used by the voice agent, such as `database.py` for database interactions and `logging.py` for configuring logging. The `api/routes/` folder contains the API route definitions, including `user_routes.py` for user-related operations.

3. **LLM Microservices**: The microservices in the `LLM_Microservices/` directory include:
   - `chains.py`: Defines the logic for processing user queries and generating responses.
   - `database.py`: Contains functions for interacting with the database, such as retrieving and updating claim information.
   - `JSON_to_Text.py`: Converts JSON data to natural language responses.
   - `llm.py`: Initializes and configures language models for generating responses.
   - `main_api.py`: Defines the FastAPI application for handling API requests.
   - `parser.py`: Parses SQL queries generated by the language models.
   - `prompts.py`: Defines prompt templates for generating SQL queries and responses.

4. **Conversational Workflow**: The `Claims.json` file in the `Conversational_Workflow_Map/` directory defines the flow of questions and responses for handling claims. This file is used by the voice agent and microservices to guide user interactions.