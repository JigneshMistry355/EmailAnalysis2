from fastapi import FastAPI, Request, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from summary import summary
import sqlite3, os, smtplib, jwt
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv
from email_data import EmailData
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from draft_response import res
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Annotated


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto') # take care of deprecated word, this is correct

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

load_dotenv()
email_id = os.getenv('EMAIL')
password = os.getenv('PASSWORD')
email_obj = EmailData(email_id, password)
email_obj.login()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRES_MINUTES = 30


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict) # returns pydantic model object --> (username, email, full_name, disabled, hashed_password)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"} 
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        return credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.disabled:
        raise HTTPException(status_code=400, details="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],) -> Token:
    print("Form data:", form_data)
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(data={"sub":user.username}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user

@app.get("/user/me/items/")
async def read_own_items(current_user: Annotated[User, Depends(get_current_active_user)]):
    return [{"item_id": "Foo", "owner": current_user.username}]


SPECS = {
    'section': ['inbox', '[Gmail]/Drafts'],
    'time': ['SINCE', 'BEFORE'],
    'readonly': [True, False],
}

@app.get('/')
def getsummary(current_user: Annotated[User, Depends(get_current_active_user)]):
    
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

    