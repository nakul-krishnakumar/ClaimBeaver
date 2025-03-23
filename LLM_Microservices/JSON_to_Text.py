from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers.string import StrOutputParser
import os
from dotenv import load_dotenv
import json

load_dotenv()
key = os.getenv('OPENAI_API_KEY')

app = FastAPI(title="Healthcare Claims Inquiry API")

class ClaimInquiryRequest(BaseModel):
    details: dict
    message: str

class ClaimInquiryResponse(BaseModel):
    response: str

def load_prompt():
    template = """"You are a HealthCare Claims Inquiry Agent. You are supposed to answer queries realted to the claims 
    raised by members. Based on the member data, claim data, plans data and plan coverage data, answer the user's question:
    
    Member Data : {member_data}
    Claim Data : {claim_data}
    Plan Data : {plan_data}
    Plan Coverage Data : {plan_coverage_data}
    
    Question : {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    return prompt

def load_llm():
    llm = ChatOpenAI(
        openai_api_base="http://192.168.4.46:1234/v1",
        openai_api_key=key,
        model_name="meta-llama-3.1-8b-instruct"
    )
    return llm

def load_chain():
    llm = load_llm()
    prompt = load_prompt()
    return prompt | llm | StrOutputParser()

def ask(json_input):
    data = json.loads(json_input)
    member_data = data["details"]["memberData"]
    claim_data = data["details"]["claimData"]
    plans = data["details"]["plans"]
    plan_coverages = data["details"]["planCoverages"]
    question = data["message"]
    
    chain = load_chain()
    
    result = chain.invoke({
        'member_data': member_data, 
        'claim_data': claim_data, 
        'plan_data': plans, 
        'plan_coverage_data': plan_coverages, 
        'question': question
    })
    return result

@app.post("/api/claims-inquiry", response_model=ClaimInquiryResponse)
async def claims_inquiry(request: ClaimInquiryRequest):
    try:
        json_input = json.dumps(request.model_dump())
        
        response = ask(json_input)
        
        return ClaimInquiryResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing inquiry: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Healthcare Claims Inquiry API is running. Use /api/claims-inquiry endpoint for inquiries."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)