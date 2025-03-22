# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_db
from chains import create_full_chain

app = FastAPI(
    title="Health Insurance Claims Inquiry API",
    description="API for querying health insurance claims data using natural language",
    version="1.0.0"
)

db = get_db()
full_chain = create_full_chain(db)

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a natural language query about health insurance claims
    and return a natural language response.
    """
    try:
        result = full_chain.invoke({"question": request.question})
        
        return QueryResponse(
            answer=result.content
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)