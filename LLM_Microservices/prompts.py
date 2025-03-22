from langchain_core.prompts import ChatPromptTemplate

SQL_PROMPT_TEMPLATE = """Based on the table schema provided below, write only the PostgreSQL query that would answer the user's question:
{schema}

Question : {question}
SQL Query:
"""

RESPONSE_PROMPT_TEMPLATE = """ You are a HealthCare Claims Inquiry Agent. You are supposed to answer queries realted to the claims 
raised by members. Based on the table schema below, question, sql query, and sql response, write a natural language response:
{schema}

Question: {question}
SQL Query: {query}
SQL Response: {response}
"""

def get_sql_prompt():
    return ChatPromptTemplate.from_template(SQL_PROMPT_TEMPLATE)

def get_response_prompt():
    return ChatPromptTemplate.from_template(RESPONSE_PROMPT_TEMPLATE)