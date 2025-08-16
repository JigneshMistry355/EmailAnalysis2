import email.utils
from dotenv import load_dotenv
import os, imaplib, email, sqlite3, re, smtplib
from datetime import datetime
import datetime
from email.header import decode_header
from email.utils import parsedate_to_datetime
from bs4 import BeautifulSoup
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from typing import List
from summary import summary
from priority import priority
from category import category
# from draft_response import draft

class EmailData:

    def __init__(self, email, password):
        self.email = email
        self.password = password

        #gmail requires IMAP4_SSL and port 993
        self.imap = imaplib.IMAP4_SSL(host=os.getenv('IMAP4_SSL_HOST'), port=os.getenv('IMAP4_SSL_PORT'))
        self.smtp = smtplib.SMTP(host=os.getenv('SMTP_SERVER'), port=os.getenv('SMTP_PORT'))


    ######### """Login to the email account.""" ##############
    def login(self):
        try :
            # returns a tuple with 2 values, 'OK' & [auth sucess]
            result, message = self.imap.login(self.email, self.password)
            if result == 'OK':
                print("Login Successful .. !")
            else:
                print("Login Failed", message)
            # returns a tuple with response code = 220 (server is ready) and message = b'2.0.0 Ready to start TLS'(confirms that the server supports STARTTLS, and it's ready to begin TLS encryption.)
            response_code, message = self.smtp.starttls()
            # returns a tuple with response code = 235 (Authentication successful) and message = b'2.7.0 Accepted' (Login accepted, credentials valid.)
            response_code, message = self.smtp.login(self.email, self.password)
        except imaplib.IMAP4.error as e:
            print("IMAP error during login", str(e))
        except smtplib.SMTPException as e:
            print(f"Authentication failed. Please check your credentials.: {e}")
        except Exception as e:
            print("Unexpected error occured during login", str(e))



    ####### """Retrieve emails received today.""" ############
    def get_emails(self, section, time, readonly):
        # search_date = datetime.datetime(2025, 6, 11)
        search_date = datetime.datetime.now()

        # Format the date to DD-MMM-YYYY (e.g., 17-Oct-2024)
        formatted_date = search_date.strftime("%d-%b-%Y")

        # Select the inbox
        emails = self.imap.select(mailbox=section, readonly=readonly)

        if section == 'inbox':
            # Search emails received on or after this date
            typ, msgnums = self.imap.search(None, f'{time} {formatted_date}')
            # messages --> an array that contains binary id of each email in the inbox in a single string 
            # eg. [b'abcd efgh ijkl mnop qrst']

        if section == '[Gmail]/Drafts':
            typ, msgnums = self.imap.search(None, f'OR ON {formatted_date} BEFORE {formatted_date}')
            if typ != 'OK':
                raise Exception(f"IMAP search failed with status: {typ}")

        # Get the list of email IDs returned by the search
        email_ids = msgnums[0].split()
        # eg. [b'abcd', b'efgh', b'ijkl', b'mnop', b'qrst']
        # print(f'{len(email_ids)} new emails found ...! ')
        # print("Email id type in get_emails ",type(email_ids[0]))
        return email_ids
    

    def decode_mime_words(self, text):
        try:
            parts = decode_header(text)
            return ''.join(
                part.decode(enc or 'utf-8') if isinstance(part, bytes) else part
                for part, enc in parts
            )
        except Exception:
            return text
        
    def clean_body(self, text):
        # Remove Unicode non-breaking spaces and zero-width characters
        text = text.replace('\xa0', ' ').replace('\u200c', '')
        # Remove multiple consecutive spaces
        text = re.sub(r'\s{2,}', ' ', text)
        # Optionally, trim leading/trailing whitespace
        return text.strip()
    

    def singleDraftDetails(self, email_id):
        history_Element = {}

        status, msg_data = self.imap.fetch(email_id, "(RFC822)")

        message = email.message_from_bytes(msg_data[0][1])

        # get receiver
        receiver = message["To"]

        # set receiver
        history_Element["receiver"] = receiver

        # get subject
        subject, encoding = decode_header(message["subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding if encoding else "utf-8")

        # set subject
        history_Element["subject"] = subject

        # get sender/user data
        sender_name, sender_email = email.utils.parseaddr(message["From"])

        # set user data
        history_Element["sender_name"] = sender_name
        history_Element["sender_email"] = sender_email

        if message.is_multipart():
            for part in message.walk():
                # Extract content type
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))

                try:
                    # Get the email body
                    body = part.get_payload(decode=True).decode()
                    body = BeautifulSoup(body, "html.parser")
                    body = body.get_text()
                    history_Element["body"] = body
                    
                    break
                except:
                    pass
        print(history_Element)
        return history_Element
        

    
    ########## """Fetch details of a single email.""" ################
    def SingleEmailDetails(self, email_id):
        history_Element = {}

        # Fetch each email by ID
        status, msg_data = self.imap.fetch(email_id, "(RFC822)")

        # Parse the email content
        msg = email.message_from_bytes(msg_data[0][1])

        # get receiver
        receiver = msg["To"]

        # set receiver
        history_Element["receiver"] = receiver

        # Get the email subject
        subject, encoding = decode_header(msg["Subject"])[0]
        if isinstance(subject, bytes):
            try:
                subject = subject.decode(encoding or "utf-8")
            except (LookupError, UnicodeDecodeError):
                subject = subject.decode("utf-8", errors="replace")

        history_Element['subject'] = subject

        # Get the sender's information
        sender_name, sender_email = email.utils.parseaddr(msg["From"])
        sender_name = self.decode_mime_words(sender_name)
        history_Element['sender_name'] = sender_name
        history_Element['sender_email'] = sender_email

        # Get the date and format it
        date_tuple = email.utils.parsedate_tz(msg["Date"])
        email_date = parsedate_to_datetime(msg["Date"]).strftime("%d-%b-%Y %H:%M:%S")
        history_Element['email_date'] = email_date


        if msg.is_multipart():
            for part in msg.walk():
                # Extract content type
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))

                try:
                    # Get the email body
                    body = part.get_payload(decode=True).decode()
                    body = BeautifulSoup(body, "html.parser")
                    body = body.get_text()
                    body = self.clean_body(body)
                    history_Element['body'] = body if body else "No text available"

                    # split_gmail = body.split(" ")
                    # print("#############################################################################")
                    # print("Body:", body, "\n\n")
                    # conversation_history.append(history_Element)
                   
                    summaryText = summary(body) 
                    history_Element['summary'] = summaryText if summaryText else None

                    p = priority(summaryText)
                    history_Element['priority'] = p if p else None

                    c = category(summaryText)
                    history_Element['category'] = c if c else None
                    
                    break
                except:
                    pass
        
        print(history_Element)
        return history_Element
    
    
    def insert_raw_data(self, email_raw_data: dict, email_id): 
        
        con = sqlite3.connect("TodaysEmail.db")
        cur = con.cursor()

        cur.execute(f"CREATE TABLE IF NOT EXISTS raw_emails(id, sender_name, sender_email, receiver, subject, body, email_date, summary, priority, category)")
        cur.execute(f"SELECT * FROM raw_emails WHERE id = ?", (email_id,))
        response = cur.fetchone()
        print("Response\n\n",type(response))

        try: 
            if response is None:
                cur.execute("INSERT INTO raw_emails (id, sender_name, sender_email, receiver, subject, body, email_date, summary, priority, category) VALUES (?,?,?,?,?,?,?,?,?,?)", 
                            (
                                email_id, 
                                email_raw_data['sender_name'], 
                                email_raw_data['sender_email'], 
                                email_raw_data['receiver'],
                                email_raw_data['subject'], 
                                email_raw_data['body'],
                                email_raw_data['email_date'], 
                                email_raw_data['summary'], 
                                email_raw_data['priority'], 
                                email_raw_data['category']
                            ))
                con.commit()
                con.close()
                return True
            else:
                print("Email data already exists.......!")
                con.commit()
                con.close()
                return False
        except Exception:
            print("COuld nor enter a value")

    def fetch_email_list(self):
        email_ids = []
        con = sqlite3.connect("TodaysEmail.db")
        cur = con.cursor()
        cur.execute(f"SELECT id FROM raw_emails")
        response = cur.fetchall()
        if response is None:
            return {"message": "No data found"}
        else:
            for i in response:
                email_ids.append(i[0])
            return email_ids

        
    def fetch_data(self):

        con = sqlite3.connect("TodaysEmail.db")
       
        cur = con.cursor()

        APP_DATA = {}
        cur.execute(f"SELECT * FROM raw_emails")
        response = cur.fetchall()
        # response = response[::-1]
        print("\n######################################\n")
        print(type(response))
        if response is None:
            return {"message": "No data found"}
        else:
            EMAIL_DATA = {
                'Email_'+str(t[0]) : {
                    'id':t[0],
                    'sender_name': t[1],
                    'sender_email': t[2],
                    'receiver': t[3],
                    'subject': t[4],
                    'body': t[5],
                    'email_date': t[6], 
                    'summary': t[7], 
                    'priority': t[8], 
                    'category': t[9],
            } for t in response}
            return EMAIL_DATA
        
    def fetch_using_id(self, id):
        id = bytes(id, encoding='utf-8')
        con = sqlite3.connect("TodaysEmail.db")
        cur = con.cursor()
        DATA = {}
        cur.execute("SELECT * FROM raw_emails WHERE id = ?",(id,))
        response = cur.fetchall()
        # print(response)
        # DATA['id'] = response[0][0]
        DATA["sender_name"] = response[0][1]
        DATA["sender_email"] = response[0][2]
        DATA["receiver"] = response[0][3]
        DATA["subject"] = response[0][4]
        DATA["body"] = response[0][5]
        return DATA
      

        

# load_dotenv()
# email_id = os.getenv('EMAIL')
# password = os.getenv('PASSWORD')
# obj = EmailData(email_id, password)        
# result = fetch_data()
# print("\n######################################\n")
# print(type(result))
# print(result)
            

        

    

if __name__ == '__main__':
    load_dotenv()
    email_id = os.getenv('EMAIL')
    password = os.getenv('PASSWORD')
    email_obj = EmailData(email_id, password)
    email_obj.login()
    myList = email_obj.fetch_email_list()
    # print(myList)
    print(type(myList[0]))
    x = str(myList[0])
    print(x)
    print(bytes(x, encoding='utf-8'))
    # email_id_list = email_obj.get_emails('inbox', 'SINCE', False)
    # print(email_id_list)
    # print(type(email_id_list[0]))


    data = email_obj.fetch_using_id(x)
    print("________>",data)
    print(type(data))

   
#     for i in email_id_list: 
#         EMAIL_DATA = email_obj.SingleEmailDetails(i)
#         success = email_obj.insert_raw_data(EMAIL_DATA, i)
#         if success: 
#             print("Data inserted for ",i)
#             print(f"{EMAIL_DATA['sender_name']}")
#             print(f"{EMAIL_DATA['sender_email']}")
#             print(f"{EMAIL_DATA['subject']}")
#             print(f"{EMAIL_DATA['body']}")
#             print(f"{EMAIL_DATA['email_date']}")
#             print(f"{EMAIL_DATA['summary']}\n\n\n")
#         else:
#             print("Something went wrong....\n\n\n")



    # def Summary(self):

    #     llm = ChatOllama(model='llama3.2:latest', temperature=0.7)

    #     prompt_template = ChatPromptTemplate([
    #         ("system", "You are a helpful assistant"),
    #         ("user", "Summarize this email {topic}")
    #     ])

    #     chain = prompt_template | llm

    #     email = """
    #         Hi everyone,

    #         We're excited to share a more affordable way to enjoy subscriber benefits on Poe. You can now access premium bots, enjoy longer conversations, and send more messages starting at $4.99/month or $49.99/year*.

    #         This new entry-level pricing, reduced from $9.99/month, makes it easier than ever to access premium bots like GPT-4.5, Claude 3.7 Sonnet, DeepSeek-R1, ElevenLabs, and many more — all in one place.

    #         We believe great AI should be accessible to everyone, and we hope this new affordable subscription helps make that possible.

    #         To upgrade, simply click "Subscribe" in the sidebar, select your preferred plan, and complete your purchase. Please note, these subscription options are currently available only through poe.com (web and mobile web).

    #         We encourage you to continue sharing any feedback or questions you may have at feedback@poe.com. If you would like to stay informed on our latest updates and announcements, you can follow us on X or join our Discord server.

    #         Thanks,
    #         The Poe Team
    #         """
    #     summary = chain.invoke({"topic": email})
    #     # response = llm.invoke(summary)
    #     return summary.content



    