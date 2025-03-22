from langchain_core.runnables import RunnablePassthrough
from parser import SQLQueryParser
from llm import LLM
from database import get_schema, run_query
from prompts import get_sql_prompt, get_response_prompt

def create_full_chain(db=None):
    llm = LLM()
    parser = SQLQueryParser()
    sql_llm = llm.get_llm('sql')
    reason_llm = llm.get_llm('reason')
    
    # SQL generation chain
    sql_prompt = get_sql_prompt()
    sql_chain = (
        RunnablePassthrough.assign(schema=lambda x: get_schema(db)) 
        | sql_prompt 
        | sql_llm.bind(stop=["\nSQLResult:"]) 
        | parser
    )
    
    # Full response chain
    response_prompt = get_response_prompt()
    full_chain = (
        RunnablePassthrough.assign(query=sql_chain).assign(
            schema=lambda x: get_schema(),
            response=lambda vars: run_query(vars["query"], db),
        )
        | response_prompt
        | reason_llm
    )
    
    return full_chain