from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate   

def summary(raw_email_body):
    llm = ChatOllama(model='llama3.2:latest', temperature=0.7)
    prompt_template = ChatPromptTemplate([
        ("system", "You are a helpful assistant"),
        ("user", "Summarize this email {topic}")
    ])
    chain = prompt_template | llm
    summary = chain.invoke({"topic": raw_email_body})
    return summary.content

def getRawData():
    pass

# result = Summary()
# print(result)