from langchain_openai import ChatOpenAI
#from langchain_google_genai import  ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

class LLM:
    def __init__(self):
        load_dotenv()
        #gemini_key = os.getenv('GEMINI_API_KEY')
        openai_key = os.getenv('OPENAI_API_KEY')
        self.sql_llm = ChatOpenAI(openai_api_base= "http://192.168.10.73:1234/v1",
            openai_api_key=openai_key,
            model_name="qwen-2.5-3b-text_to_sql"
        )
        self.reason_llm = ChatOpenAI(openai_api_base= "http://192.168.4.46:1234/v1",
            openai_api_key=openai_key,
            model_name="meta-llama-3.1-8b-instruct"
        )
    def get_llm(self,name):
        if name == 'sql':
            return self.sql_llm
        elif name == 'reason':
            return self.reason_llm
        else:
            print ("Invalid LLM name")
            return
        