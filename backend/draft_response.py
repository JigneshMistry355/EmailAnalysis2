from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.prompts.structured import StructuredPrompt 
from pydantic import BaseModel
import json
# from email_data import fetch_using_id

# def draft(raw_email_body):
#     llm = ChatOllama(model='llama3.2:latest', temperature=0.7)
#     prompt_template = ChatPromptTemplate([
#         ("system", "You are a helpful assistant"),
#         ("user", "Generate a formal response to this email {topic}")
#     ])
#     chain = prompt_template | llm
#     draft = chain.invoke({"topic": raw_email_body})
#     return draft.content

class Response(BaseModel):
    subject: str
    body: str



def res(data):

    user_query = "Tell that I will be ready for the interview."

    template = {
        "system": "You are a helpful assistant",
        "user": "Generate an formal email reply to \n {email}"
    }

    # data = {
    #     "From": "sakshichandradkar@gmail.com",
    #     "To":"jigneshmsitry@gmail.com",
    #     "subject": "Interview Invitation",
    #     "body": '''Hi Jignesh,
    #         We are pleased to invite you for an interview. Your application stood out among many qualified candidates, and we would like to meet with you in personal to discuss your qualifications further.
    #         Submit Your Resume {You Must Complete and fill all your details in Registration then only you will get Interview Call}

    #         Please confirm your attendance at your earliest convenience by replying to this email. We look forward to meeting you and discussing your potential contributions to our team.
    #         Warm regards,
    #         Sakshi Chandradkar
    #     '''
    # }

    json_string = json.dumps(data, indent=2)

    prompt = f"""Here is the subject and body of an email in json format:
            {json_string}
            Based on this email construct a formal response body. Do not forget the subject.
            """
    

    prompt = PromptTemplate.from_template(template["user"])
    

    final_prompt = prompt.format(email=json_string)
    # print(final_prompt)

    llm = ChatOllama(model="llama3.2:latest", temperature=0)
    structured_model = llm.with_structured_output(
        schema=Response,
        method="json_schema",
        include_raw=False
    )

    result = structured_model.invoke(final_prompt)

    result = result.model_dump()
    # print(result)

    return result

# result = res()
# print(result)

def response(body):
    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                '''
                You are an expert content generator. 
                You thoroughly understand the content of email.
                The email is to be sent in response to received email.
                You will be provided with subject and body.
                Generate a subject in response to this email.
                Generate a formal response body to this email.
                '''
            ),
            (
                "human",
                "{text}"
            )
        ]
    ) 

    llm = ChatOllama(model="llama3.2", temperature=0)

    structure_model = llm.with_structured_output(
            schema=Response,
            method="json_schema",
            include_raw=False
    )

    text = body

    prompt = prompt_template.invoke({"text": text})

    result = structure_model.invoke(prompt)

    result = result.model_dump()

    print(result)


# body = '''
# 'Hey Jignesh Mistry, \u200b We’re just 3 hours away from the Career Branding Masterclass — and it’s more than just a session. It’s a wake-up call for performers who’ve been doing everything right… but still not rising. If you’ve ever felt seen but not valued, appreciated but not promoted — this is for you. Today’s focus 👇 * The 5 Career Capitals that shape your rise * Simple shifts that make you unmissable * Why visibility, not just performance, drives career growth 🕚 We begin at 11:00 AM sharp 👉 Join with this link - [Career Branding Masterclass] ( https://click.convertkit-mail2.com/gkul57k05ph5hlzmldrcrh87m0999bmhnr08d/p8heh9h45043zlsq/aHR0cHM6Ly9zYWtzaGlicmFuZGluZy5jb20vem9vbWxpdmU= )\u200b Get ready to rebrand how the world sees your worth. \u200b To Your Brand’s Success, Sakshi Chandraakar \u200b It’s our mission to build a strong community centered around career branding! We love to share cool insights with you! We love to help people learn how to take their career to the next level by simply a few small tweaks. Every day we are building and strengthening partnerships with companies and missions that allign with our values. Career Branding Hub is owned and operated by Finessse . We are committed to advising you of the right to your privacy, and strives to provide a safe and secure user experience. Our Privacy Policy explains how we collect, store and use personal information, provided by you on our website. It also explains how we collect and use non-personal information. By accessing and using our website, you explicitly accept, without limitation or qualification, the collection, use and transfer of the personal information and non-personal information in the manner described in our Privacy Policy. Please read this Policy on our website(s) carefully, as it affects your rights and liabilities under the law. If you disagree with the way we collect and process personal and non-personal information, please do not use this website. This Policy applies to this website as well as all webpages Company hosts. It regulates the processing of information relating to you and grants both of us various rights with respect to your personal data. It also informs you of how to notify us to stop using your personal information. We are located in India. You may be located in a country that has laws which are more restrictive about the collection and use of your personal information. However, by using our website, you agree to waive the more restrictive laws and agree to be governed by the laws of India, If you wish to view our official policies, please visit our website. At Career Branding Hub, we are strongly committed to protecting your privacy and providing a safe & high-quality online experience for all of our visitors. We understand that you care about how the information you provide to us is used and shared. We have developed a Privacy Policy to inform you of our policies regarding the collection, use, and disclosure of information we receive from users of our website. Career Branding Hub operates the Website. Our Privacy Policy, along with our Term & Conditions, governs your use of this site. By using sakshichandraakar.com, or by accepting the Terms of Use (via opt-in, checkbox, pop-up, or clicking an email link confirming the same), you agree to be bound by our Terms & Conditions and our Privacy Policy. If you have provided personal, billing, or other voluntarily provided information, you may access, review, and make changes to it via instructions found on the Website or by emailing us at connect@sakshichandraakar.com. To manage your receipt of marketing and non-transactional communications, you may unsubscribe by clicking the “unsubscribe” link located on the bottom of any marketing email. Emails related to the purchase or delivery of orders are provided automatically – Customers are not able to opt out of transactional emails. We will try to accommodate any requests related to the management of Personal Information in a timely manner. However, it is not always possible to completely remove or modify information in our databases (for example, if we have a legal obligation to keep it for certain timeframes, for example). If you have any questions, simply reply to this email or visit our website to view our official policies. \u200b \u200bUnsubscribe ( https://unsubscribe.convertkit-mail2.com/gkul57k05ph5hlzmldrcrh87m0999bmhnr08d ) | Update your profile ( https://preferences.convertkit-mail2.com/gkul57k05ph5hlzmldrcrh87m0999bmhnr08d ) | Malad, Mumbai, Maharashtra 400095 ( https://click.convertkit-mail2.com/gkul57k05ph5hlzmldrcrh87m0999bmhnr08d/dpheh0hewge40qbm/aHR0cHM6Ly9idWlsdHdpdGgua2l0LmNvbT91dG1fY2FtcGFpZ249cG93ZXJlZGJ5JnV0bV9jb250ZW50PWVtYWlsJnV0bV9tZWRpdW09cmVmZXJyYWwmdXRtX3NvdXJjZT1keW5hbWlj 
# '''
# response(body)