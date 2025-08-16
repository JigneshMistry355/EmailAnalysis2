from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
import getpass, os
from langchain.chat_models import init_chat_model


class Priority(BaseModel):
    """Priority of the email"""

    priority: str = Field(default=None, description="Priority of the email")

    def __str__(self):
        return super().__str__()


def priority(summary):

    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                '''You are an expert analyst algorithm. 
                You thoroughly understand the content of email.
                You return one of the [urgent, high, medium, low] priority of the email. 
                If you do not know the value of an attribute asked to extract.
                return null for the attribute's value.'''
            ),
            (
                "human",
                "{text}"
            )
        ]
    ) 

    llm = ChatOllama(model="llama3.2", temperature=0)

    structure_model = llm.with_structured_output(
            schema=Priority,
            method="json_schema",
            include_raw=False
    )

    text = summary

    prompt = prompt_template.invoke({"text": text})

    result = structure_model.invoke(prompt)

    result = result.model_dump()

    # print(result['priority'])
    # print(type(result))
    return result['priority']



# for testing 

text = '''The email from Dependabot on GitHub alerts the user (JigneshMistry355) to several vulnerabilities in their project "EmailAnalysis". The following issues were detected:

    * A vulnerability in nanoid dependency with versions < 3.3.8 that needs to be upgraded to 3.3.8.
    * Vulnerabilities in another dependency with versions >= 14.0.0, < 14.2.21 that need to be upgraded to 14.2.21.

    The email provides links to view all vulnerable dependencies and change notification preferences.

    **Vulnerability Details:**

    - CVE-2024-55565 (Moderate severity)
    - CVE-2025-48068 (Low severity) (duplicated)
    - CVE-2024-56332 (Moderate severity)

    **Actions:**

    * View all vulnerable dependencies: https://github.com/JigneshMistry355/EmailAnalysis/security/dependabot
    * Change notification preferences: https://github/settings/notifications#vulnerability-alerts-heading
    * Update email preferences: https://github/settings/emails
    * Unsubscribe from this email: https://github/email/unsubscribe?token=ALIPLJGVQ6QUBVU2ZNWOCILKGISAFANENZQW2ZNNOZ2WY3TFOJQWE2LMNF2HS'''
priority(text)