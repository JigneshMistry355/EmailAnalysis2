from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from summary import summary
import sqlite3, os, smtplib
from dotenv import load_dotenv
from email_data import EmailData
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from draft_response import res

app = FastAPI()
load_dotenv()
email_id = os.getenv('EMAIL')
password = os.getenv('PASSWORD')
email_obj = EmailData(email_id, password)
email_obj.login()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

SPECS = {
    'section': ['inbox', '[Gmail]/Drafts'],
    'time': ['SINCE', 'BEFORE'],
    'readonly': [True, False],
}

@app.get('/')
def getsummary():
    
    email_id_list = email_obj.get_emails(SPECS['section'][0], SPECS['time'][0], SPECS['readonly'][1])
    email_id_from_database = email_obj.fetch_email_list()
    
    for i in email_id_list: 
        if i not in email_id_from_database:
            EMAIL_DATA = email_obj.SingleEmailDetails(i)
            success = email_obj.insert_raw_data(EMAIL_DATA, i)
            if success: 
                print("Data inserted for ",i)
                # print(f"{EMAIL_DATA['sender_name']}")
                # print(f"{EMAIL_DATA['sender_email']}")
                # print(f"{EMAIL_DATA['subject']}")
                # # print(f"{EMAIL_DATA['body']}")
                # print(f"{EMAIL_DATA['email_date']}")
                # print(f"\nsummary\n{EMAIL_DATA['summary']}\n\n\n")
            
            else:
                print("Data exists in Database ....\n\n\n")
    APP_DATA = email_obj.fetch_data()
    return APP_DATA


@app.get('/drafts')
def getDrafts():
    # load_dotenv()
    # email_id = os.getenv('EMAIL')
    # password = os.getenv('PASSWORD')
    # email_obj = EmailData(email_id, password)
    # email_obj.login()
    APP_DATA = {}
    email_id_list = email_obj.get_emails(SPECS['section'][1], SPECS['time'][1], SPECS['readonly'][1])
    email_id_list = email_id_list[::-1]
    print(email_id_list)
    for i in email_id_list:
        # temp.append(i)
        EMAIL_DATA = email_obj.singleDraftDetails(i)
        APP_DATA['Email_'+str(i)] = EMAIL_DATA
    return APP_DATA   


class SendRequest(BaseModel):
    sender_email: str
    receiver: str
    subject: str
    body: str


@app.post('/send_email')
async def sendEmail(data: SendRequest):
    load_dotenv()
    email_id = os.getenv('EMAIL')
    password = os.getenv('PASSWORD')
    email_obj = EmailData(email_id, password)
    email_obj.login()
    message = MIMEMultipart()
    message["From"] = data.sender_email
    message["To"] = data.receiver
    message["Subject"] = data.subject
    message.attach(MIMEText(data.body, 'plain'))
    try:
        response = email_obj.smtp.sendmail(email_id, data.receiver, message.as_string())
        # email_obj.smtp.quit() --> terminate session
        return response
    except smtplib.SMTPException as e:
        print(f"Login Failed {e}")
        return f"Login Failed {e}"
    except Exception as e:
        print(f"An error occured while sending email {e}")
        return f"An error occured while sending email {e}"
    
class GenerateResponse(BaseModel):
    id: str
    
@app.post('/generate_response')
async def generate_response(data: GenerateResponse):
    x = data.id
    response = email_obj.fetch_using_id(x)
    gen_res = res(response)
    # print("\n ...........AI Response ............. \n", gen_res)
    return gen_res
    


@app.get("/port")
async def get_port(request: Request):
    # Extract the port from the request URL
    port = request.url.port
    return {"port": port}

    