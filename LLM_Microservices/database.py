from langchain_community.utilities import SQLDatabase

def get_db():
    from config import MYSQL_URI
    return SQLDatabase.from_uri(MYSQL_URI)

def get_schema(db=None):
    #db = None : To the actual output
    if db:
        schema = db.get_table_info()
        return schema
    else:
        with open('schema.txt', 'r') as f:
            return f.read()

def run_query(query, db):
    print("Query : ", query)
    return db.run(query)