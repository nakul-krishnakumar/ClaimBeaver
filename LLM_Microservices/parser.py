from langchain_core.messages import AIMessage
from langchain.schema import BaseOutputParser
import re

class SQLQueryParser(BaseOutputParser):
    """Parses and extracts raw SQL queries from LLM responses."""
    
    def parse(self, text: AIMessage) -> str:
        text = text.content if isinstance(text, AIMessage) else text
        sql_match = re.search(r"```sql\n(.*?)\n```", text, re.DOTALL)
        if sql_match:
            return sql_match.group(1).strip()
        sql_lines = []
        found_sql_query = False
        
        for line in text.split('\n'):
            if re.search(r"SQL Query:", line, re.IGNORECASE):
                found_sql_query = True
                query_part = re.sub(r".*SQL Query:\s*", "", line)
                if query_part: 
                    sql_lines.append(query_part)
                continue

            if found_sql_query and line.strip():
                sql_lines.append(line)
        
        if sql_lines:
            return " ".join(sql_lines).strip().rstrip(';')
        
        return text.strip().replace('\n', ' ')