'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { log } from "console";
import { useAuth } from "../contexts/AuthContext";

type EmailSummary = {
    id: any;
    sender_name: string;
    sender_email: string;
    receiver: string;
    subject: string;
    body: string;
    email_date:string;
    summary: string;
    category: string; 
    priority: string;
};

export default function Dashboard(){

    const { token, logout } = useAuth();
    const router = useRouter();
    const pathName = usePathname();
    const [user, setUser] = useState<any>(null);

    const api = axios.create({
        baseURL: 'http://localhost:8000',
    });

 

    const myData = {"Email_b'5025'": {"Sender_Name": "Highire Manpower Services", "Sender_Email": "vacancy@openings.shine.com", "Subject": "Urgent Hiring for Front End Developer at Freelancer", "Response": "Here is a short summary:\n\n\"Urgent hiring for Front End Developer at Freelancer. Job posting from Highire Manpower Services (vacancy@openings.shine.com) on October 21, 2024.\""}, "Email_b'5026'": {"Sender_Name": "", "Sender_Email": "olivia@mail.nanonets.com", "Subject": "Curious About Nanonets? ", "Response": "Here is a short summary:\n\n\"Job inquiry about Nanonets from Olivia (olivia@mail.nanonets.com) on October 21, 2024.\""}, "Email_b'5027'": {"Sender_Name": "Indeed Apply", "Sender_Email": "indeedapply@indeed.com", "Subject": "Indeed Application: Data Scientist (AI Model Training & Insights)", "Response": "Here is a short summary:\n\n\"Job application for Data Scientist (AI Model Training & Insights) at Indeed Apply (indeedapply@indeed.com) on October 21, 2024.\""}, "Email_b'5028'": {"Sender_Name": "Indeed Apply", "Sender_Email": "indeedapply@indeed.com", "Subject": "Indeed Application: AI/ML Developer", "Response": "Here is the generated short summary:\n\n\"Job application for AI/ML Developer at Indeed Apply (indeedapply@indeed.com) on October 21, 2024.\""}, "Email_b'5029'": {"Sender_Name": "RITIK RAHI", "Sender_Email": "invitations@linkedin.com", "Subject": "Sahil, please add me to your LinkedIn network", "Response": "Here is a short summary:\n\nSahil Jadhav (Jr. AI Developer) has sent you an invitation to connect on LinkedIn. This email was intended for Sahil, but it appears you received an invitation to join his professional network. You can accept or decline the invitation by clicking on the provided link."}, "Email_b'5030'": {"Sender_Name": "upGrad", "Sender_Email": "alerts@admissions.upgrad.com", "Subject": "Can't wait to get ahead? Here's the program you've been looking for!", "Response": "Here is a short summary:\n\nYou have received an email from upGrad (alerts@admissions.upgrad.com) on October 21, 2024 at 7:44 AM. The subject of the email is \"Can't wait to get ahead? Here's the program you've been looking for!\"."}, "Email_b'5031'": {"Sender_Name": "Highire Manpower Services", "Sender_Email": "vacancy@openings.shine.com", "Subject": "Urgent Hiring for Customer Relation Officer at Hdfc Bank", "Response": "Here is a short summary:\n\nYou have received an email from Highire Manpower Services (vacancy@openings.shine.com) on October 21, 2024 at 1:24 PM. The subject of the email is \"Urgent Hiring for Customer Relation Officer at Hdfc Bank\"."}, "Email_b'5032'": {"Sender_Name": "Amity University", "Sender_Email": "mail@timesjobs.com", "Subject": "You are selected for MBA(Online) program with Amity University", "Response": "Here is a short summary of the content:\n\n\"You are selected for an MBA (Online) program. Click on 'Edit your details' to confirm and edit your information if needed. This email was sent by TimesJobs.com as part of their service.\""}, "Email_b'5033'": {"Sender_Name": "Amity University", "Sender_Email": "mail@timesjobs.com", "Subject": "You are selected for MBA(Online) program with Amity University", "Response": "Here is a short summary:\n\nYou have been selected for the MBA (Online) program. You are receiving this email as you are a registered user with TimesJobs.com. The link provided can be used to edit your details or unsubscribe from further emails."}, "Email_b'5034'": {"Sender_Name": "upGrad", "Sender_Email": "alerts@admissions.upgrad.com", "Subject": "Start Now ", "Response": "Here is a short summary:\n\n\"Congratulations! You have been selected for the MBA (Online) program. - upGrad <alerts@admissions.upgrad.com> on October 21, 2024 at 9:29:05 AM.\""}, "Email_b'5035'": {"Sender_Name": "LinkedIn", "Sender_Email": "jobs-listings@linkedin.com", "Subject": "Stealth Startup is hiring a Machine Learning Engineer", "Response": "Here is a short summary:\n\n**Job Opportunity:**\n\nStealth Startup is hiring a Machine Learning Engineer. This job opportunity was sent to you because you have opted-in for \"Jobs You Might Be Interested In\" emails from LinkedIn."}, "Email_b'5036'": {"Sender_Name": "Naukri", "Sender_Email": "info@naukri.com", "Subject": "Feedback on your Naukri job applies done since last week", "Response": "This appears to be an HTML email template from Naukri, a popular Indian job search platform. The email contains a table with several rows and columns, including a link to \"Security Advice\" for more information.\n\nThe main content of the email is not visible as it's encoded in a way that requires decryption to view. However, the surrounding HTML code suggests that this email may be related to a job application or job search activity on Naukri."}, "Email_b'5037'": {"Sender_Name": "Ashwini Poojari", "Sender_Email": "ashwini.poojari@datenwissen.com", "Subject": "Invitation from an unknown sender: AI - Interview  @ Tue 22 Oct 2024\r\n 5pm - 5:10pm (IST) (sahiljadhav25009@gmail.com)", "Response": "Here is a short summary:\n\nThe email is an invitation from Ashwini Poojari to an AI Interview on October 22, 2024, at 5:00-5:10 pm IST (India Standard Time - Kolkata). The interview will take place via Google Meet and also offers phone-in options. The email includes links for more information and details about the event."}}

    const myDate1 = {"Email_b'5161'": {"Sender_Name": "", "Sender_Email": "olivia@mail.nanonets.com", "Subject": "Cut Manual Data Entry by 80% Instantly, here's how!", "Response": "Here are the short summaries:\n\n1. {'subject': 'Top Jobs from Leading IT/Tech Companies like Amazon, Ola, Paytm etc', 'sender_name': 'hirist.tech', 'sender_email': 'info@hirist.tech', 'email_date': '28-Oct-2024 03:42:11', 'body': 'Please Enable Javascript'}\n\"Unlock top job opportunities from renowned IT/Tech companies like Amazon, Ola, and Paytm with Hirist.tech's exclusive list.\"\n\n2. {'subject': \"Cut Manual Data Entry by 80% Instantly, here's how!\", 'sender_name': '', 'sender_email': 'olivia@mail.nanonets.com', 'email_date': '28-Oct-2024 05:26:44'}\n\"Discover a game-changing way to automate data entry and boost productivity by 80%. Get instant access to the solution from Nanonets.\"", "Email_date": "28-Oct-2024 05:26:44"}, "Email_b'5160'": {"Sender_Name": "hirist.tech", "Sender_Email": "info@hirist.tech", "Subject": "Top Jobs from Leading IT/Tech Companies like Amazon, Ola, Paytm etc", "Response": "Here is a short summary:\n\n\"Get the latest job updates from top IT/Tech companies like Amazon, Ola, and Paytm. Stay ahead in your career with Hirist.tech's exclusive list of leading jobs.\"", "Email_date": "28-Oct-2024 03:42:11"}};

    


    const [summary, setSummary] = useState<Record<string, EmailSummary> | null>(null);
    const [data, setData] = useState<Record<string, EmailSummary> | null>(null);

    const [categorySorted, setCategorySorted] = useState<EmailSummary[] | null>();
    const [prioritySorted, setPrioritySorted] = useState<EmailSummary[] | null>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const [sortByCategory, setSortByCategory] = useState(false);
    const [reverseDate, setReverseDate] = useState(true);
    const [sortedByPriority, setSortedByPriority] = useState(false);

    useEffect(() => {
        if (!token) {
            // logout();
            console.log("EMPTY TOKEN ________________________________________________")
            return;
        }
        api.get("/users/me/", {headers: { Authorization: `Bearer ${token}` },})
        .then((res) => {
            setUser(res.data);
            console.log("User fetched:", res.data);
        })
        .catch(() => router.push("/Login"))

        console.log("#################################################")
        console.log("JWT", user)
        console.log("#################################################")
      }, [token]);

    useEffect(() => {
       
        // Ensure this code runs only on the client side
        if (typeof window !== 'undefined') {
            
          // Your client-side code here
          console.log("Summary variable dat\n......")
          console.log(summary)
          console.log("Hello")
          
        }
      }, [summary]);

      useEffect(() => {
        fetchData();
        const storedData = localStorage.getItem("myData");
        if (storedData) {
          setSummary(JSON.parse(storedData));
        }
      }, []);

      useEffect(() => {
        if (user){
            console.log("Updated user state: ", user);
        }
      }, [user]);


    const sortByDateList = () => {
        setSortByCategory(false);
        setReverseDate(true);
        setSortedByPriority(false);
    }

    const fetchData = async () => {
        try {
            setIsLoading(true)
            console.log("Into fetchData try ... fetching data!");
            // const token = localStorage.getItem("token");
            console.log("TOKEN CHECL :::::::::::::::::::: ############## ::::::::::::::::", token);
            const response = await axios.get('http://127.0.0.1:8000/', {headers: {Authorization: `Bearer ${token}`}});
            console.log('//////////////////////////////////////////////////////////////////////////////')
            console.log(response.data.status);
            console.log('//////////////////////////////////////////////////////////////////////////////')
            setSummary(response.data);
            console.log("Saving data to local storage")
            localStorage.setItem("myData", JSON.stringify(response.data))
            setIsLoading(false)
            

        }catch(error: any) {
            console.error("Error fetching data : ", error);
            if (error.status == 401){
                alert("Unauthorized Access ...!");
                logout();
            }
        }
    }

    const sortData = () => {
        if (summary) {
            const sortedKeys = Object.keys(summary).sort((a, b) => {
                return summary[a].category
                .localeCompare(summary[b].category
                );
            });   
            const sortedSummary = sortedKeys.map(key => summary[key]);
            console.log(sortedSummary);
            
            const emailSummary = sortedSummary.map(item => ({
                id: item.id,
                sender_name : item.sender_name,
                sender_email : item.sender_email,
                receiver: item.receiver,
                subject : item.subject,
                body : item.body,
                email_date : item.email_date,
                summary: item.summary,
                category : item.category,
                priority : item.priority,
            }));
            setCategorySorted(emailSummary);
            setSortByCategory(true);
            setReverseDate(false);
            setSortedByPriority(false);
        }
    }

    const sortByPriority = () => {
        const priorityOrder = ["urgent", "high", "medium", "low"];
        if (summary) {
            const sortedByPriority = Object.values(summary).sort((a, b) => {
                // return summary[a].Priority
                // .localeCompare(summary[b].Priority
                // );
                return priorityOrder.indexOf(a.priority?.toLowerCase()) - priorityOrder.indexOf(b.priority.toLowerCase());
            });
            console.log("Sorted By Priority ==> \n");
            console.log(sortedByPriority);
            // if (summary) {
            //     const sortedByPriority = Object.keys(summary).sort((a, b) => {
            //         return priorityOrder.indexOf(a) - priorityOrder.indexOf(b);
            //     });
            // }
            // Map sorted keys to the summary values
            // const sortedSummary = sortedByPriority.map(values => summary[key]);
            
            // const emailSummary = sortedSummary.map(item => ({
            //     Sender_Name: item.Sender_Name,
            //     Sender_Email: item.Sender_Email,
            //     Subject: item.Subject,
            //     Response: item.Response,
            //     Email_date: item.Email_date,
            //     Category: item.Category,
            //     Priority: item.Priority,
            // }));

            setReverseDate(false);
            setSortByCategory(false);
            setSortedByPriority(true);
    
            // console.log(emailSummary);
            setPrioritySorted(sortedByPriority);
        }
    };

    const respond_now = async (item: any) => {
        // console.log("Items to send", JSON.stringify(item));
        const data_id = {"id": item.id}
        console.log("\nId if email ===============>\n", data_id);
        try {
            setIsLoading(true);
            
            const response = await axios.post('http://localhost:8000/generate_response/', item);
            // console.log(response.status);
            // console.log("Logging response data for send data:");
            console.log(response.data);
            let subject = response.data?.subject;
            let body = response.data?.body; 
            // alert("Email generated successfully..!")
            setIsLoading(false);

            const myData = {"sender_email": item.receiver, "receiver": item.sender_email  , "subject": subject,  "body": body};

            router.push(`/Draft?data=${encodeURIComponent(JSON.stringify(myData))}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    const draft_email = async (item: any) => {
        console.log("Items to send", item);
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:8000/draft_email/', item);
            console.log(response.status);

            console.log("Logging response data for draft:");
            console.log(response.data);

            const draft_data = response.data

            alert("Draft saved successfully..!");
            setIsLoading(false);

            // router.push(`/Draft?data=${encodeURIComponent(JSON.stringify(draft_data))}`);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    

    // const sortByAlpha = Object.keys(summary).sort((a, b)) => {
    //     return summary[a].name.localeCompare(summary[b].name)
    // }

        return (
           <div className="relative flex bg-black h-full min-h-screen font-mono text-base pt-7">
                <div className=" flex-row w-1/4 bg-black mt-4">
                    <div className={`flex-col mx-1 my-2 px-8 py-4 bg-gradient-to-b from-black via-gray-800 to-emerald-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-purple-600 hover:to-yellow-400 transition duration-300 rounded-sm shadow-xlhover:cursor-pointer text-center text-amber-300 ${pathName === '/dashboard' ? "bg-gradient-to-r from-yellow-300 via-gray-800 to-yellow-300 text-white" : ""} `}>
                        <button onClick={() => {}}>
                              INBOX
                        </button>
                    </div>
                    <div className="flex-col mx-1 my-2 px-8 py-4 bg-gradient-to-b from-black via-gray-800 to-emerald-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 rounded-sm shadow-xl hover:cursor-pointer text-center text-amber-300">
                        <button onClick={() => router.push('/Draft')}>
                             COMPOSE
                        </button>
                    </div>
                    <div className="flex-col mx-1 my-2 px-8 py-4 bg-gradient-to-b from-black via-gray-800 to-emerald-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 rounded-sm shadow-xl hover:cursor-pointer text-center text-amber-300">
                        <button onClick={() => {router.push('/DraftList')}}>
                             DRAFTS
                        </button>
                    </div>
                    <div className="flex-col mx-1 my-2 px-8 py-4 bg-gradient-to-b from-black via-gray-800 to-emerald-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 rounded-sm shadow-xl hover:cursor-pointer text-center text-amber-300">
                        <button onClick={() => alert("Showing data related to Deep")}>
                            SENT
                        </button>
                    </div>
                    <div className="flex-col mx-1 my-2 px-8 py-4 bg-gradient-to-b from-black via-gray-800 to-emerald-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 rounded-sm shadow-xl hover:cursor-pointer text-center text-amber-300">
                        <button onClick={() => alert("Showing data related to Hemant")}>
                        Usecase Z
                        </button>
                    </div>
                </div>

                <div className="flex-row w-3/4 text-justify">

                <div className=" absolute right-32 inline-block text-left top-2">
                    <button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={fetchData}>Refresh</button>
                </div>

                <Menu as="div" className=" absolute right-3 inline-block text-left top-2">
                    <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Sort By
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        <div className="py-1">
                        <MenuItem>
                            <button
                            onClick={sortData}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                            Category
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                            onClick={sortByPriority}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                            Priority
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                            onClick={sortByDateList}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                            Date
                            </button>
                        </MenuItem>
                        <form action="#" method="POST">
                            <MenuItem>
                            <button
                                type="submit"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                                Sign out
                            </button>
                            </MenuItem>
                        </form>
                        </div>
                    </MenuItems>
                </Menu>

                { isLoading && (
                    <div className="flex justify-center items-center h-3/4">

                    <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                )}

                {!isLoading && !reverseDate && sortByCategory && categorySorted?.map((item, index) => (
                        <div className="relative flex-col mx-2 my-6 px-8 py-4 pt-10 bg-gradient-to-r from-emerald-800 to-black rounded-md shadow-xl text-white right-0 contain-inline-size text-nowrap">
                           
                                    {Object.entries(item).map(([key, val]) => (
                                        <div key={key}>
                                            {key === "category" && (
                                                <div className="absolute top-2 right-2/4 text-ellipsis overflow-hidden">
                                                    Category : {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            {key === "priority" && (
                                                <div className={`absolute top-2 right-64 text-ellipsis overflow-hidden ${val === 'high' ? "text-red-500" : "" } ${val === 'medium' ? "text-yellow-600" : ""} ${val === 'low' ? "text-green-700" : ""} ${val === 'urgent' ? "text-red-700" : "" }`}>
                                                    Priority : {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            {key === "email_date" && (
                                                <div className="absolute top-2 right-5 text-ellipsis overflow-hidden">
                                                    {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            { key !=="email_date" && key !== "category" && key !== "priority" && key !== "body" && key !== 'receiver' &&  (
                                            <table key={index}>
                                                <tbody>
                                                    <tr key={key}>
                                                        <th className="w-36 align-top">
                                                            <strong className="text-yellow-100">{key} : </strong>
                                                        </th>
                                                        <td className="text-justify inline text-wrap">
                                                            {typeof val === 'object' ? JSON.stringify(val) : val}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            )}
                                        </div>
                                    ))}
                    <div className="flex flex-row-reverse mt-2">
                        <button onClick={() => respond_now(item)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Reply Now</button>
                        <button onClick={() => draft_email(item)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Draft email</button>
                    </div>
                                
                        </div>
                    ))}

                    {!isLoading && !reverseDate && sortedByPriority && prioritySorted?.map((item, index) => (
                        <div className="relative flex-col mx-2 my-6 px-8 py-4 pt-10 bg-gradient-to-r from-emerald-800 to-black rounded-md shadow-xl text-white right-0 contain-inline-size text-nowrap">
                           
                                    {Object.entries(item).map(([key, val]) => (
                                        <div key={key}>
                                            {key === "category" && (
                                                <div className="absolute top-2 right-2/4 text-ellipsis overflow-hidden">
                                                    Category : {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            {key === "priority" && (
                                                <div className={`absolute top-2 right-64 text-ellipsis overflow-hidden ${val === 'high' ? "text-red-500" : "" } ${val === 'medium' ? "text-yellow-600" : ""} ${val === 'low' ? "text-green-700" : ""} ${val === 'urgent' ? "text-red-700" : "" }`}>
                                                    Priority : {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            {key === "email_date" && (
                                                <div className="absolute top-2 right-5 text-ellipsis overflow-hidden">
                                                    {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </div>
                                            )}

                                            { key !=="email_date" && key !== "category" && key !== "priority" && key !=="body" && key !== 'receiver' &&  (
                                            <table key={index}>
                                                <tbody>
                                                    <tr key={key}>
                                                        <th className="w-36 align-top">
                                                            <strong className="text-yellow-100">{key} : </strong>
                                                        </th>
                                                        <td className="text-justify inline text-wrap">
                                                            {typeof val === 'object' ? JSON.stringify(val) : val}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            )}
                                        </div>
                                    ))}
                    <div className="flex flex-row-reverse mt-2">
                        <button onClick={() => respond_now(item)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Reply Now</button>
                        <button onClick={() => draft_email(item)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Draft email</button>
                    </div>
                                
                        </div>
                    ))}

                
                {!isLoading && summary && reverseDate===true && Object.entries(summary).map(([key, value]) => (

                    <div className="relative flex-col mx-2 my-6 px-8 py-4 pt-10 bg-gradient-to-r from-emerald-800 to-black rounded-md shadow-xl text-white right-0 contain-inline-size text-nowrap" key={key}>

                    
                    
                    {typeof value === 'object' && value !== null && !Array.isArray(value)  ? (
                        
                        Object.entries(value).map(([key1, val]) => (
                            <div key={key1}>

                                {key1 === "category" && (
                                    <div className="absolute top-2 right-2/4 text-ellipsis overflow-hidden">
                                        Category : {typeof val === 'object' ? JSON.stringify(val) : val}
                                    </div>
                                )}

                                
                                {key1 === "priority" && (
                                <div className={`absolute top-2 right-64 text-ellipsis overflow-hidden ${val === 'high' ? "text-red-500" : "" } ${val === 'medium' ? "text-yellow-600" : ""} ${val === 'low' ? "text-green-700" : ""} ${val === 'urgent' ? "text-red-700" : "" }`}>
                                    Priority : {typeof val === 'object' ? JSON.stringify(val) : val}
                                </div>
                                )}

                                {key1 === "email_date" && (
                                    <div className="absolute top-2 right-5 text-ellipsis overflow-hidden">
                                        {typeof val === 'object' ? JSON.stringify(val) : val}
                                    </div>
                                )}

                                {key1 !== "email_date" && key1 !== "category" && key1 !== "priority" && key1 !== "body" && key1 !== 'receiver' && (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th className="w-36 align-top">
                                                    <strong className="text-yellow-100">{key1}:</strong>
                                                </th>
                                                <td className="text-justify inline text-wrap">
                                                    {typeof val === 'object' ? JSON.stringify(val) : val}
                                                </td>
                                            </tr>
                                            <tr>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                                {/* <strong className="text-black">{key1}:</strong> {typeof val === 'object' ? JSON.stringify(val) : val} */}
                            </div>
                        ))
                    ) : (
                        JSON.stringify(value)
                    )}
                    <div className="flex flex-row-reverse mt-2">
                        <button onClick={() => respond_now(value)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Reply Now</button>
                        <button onClick={() => draft_email(value)} className="bg-yellow-100 text-gray-700 hover:bg-yellow-600 hover:text-white mx-3 p-2 rounded-md">Draft email</button>
                    </div>
                     

                </div>
                ))}

               

                

                 {/*  */}
                </div>
           </div>
        );
    }

    
            
    
    // <div>

                
    // <div className="relative flex-col mx-2 my-6 px-8 py-10 bg-gradient-to-r from-cyan-300 to-blue-500 rounded-2xl shadow-xl text-gray-800 right-0 contain-inline-size text-nowrap">

    // {categorySorted && reverseDate === false && Array.isArray(categorySorted) ? (
        
    //         categorySorted?.map((item, index) => (
    //             <table key={index}>
    //                 <tbody>
    //                     {Object.entries(item).map(([key, val]) => (
    //                     <div>
    //                         <tr key={key}>
    //                             <th className="w-36 align-top">
    //                                 <strong className="text-black">{key}:</strong>
    //                             </th>
    //                             <td className="text-justify inline text-wrap">
    //                                 {typeof val === 'object' ? JSON.stringify(val) : val}
    //                             </td>
    //                         </tr>
    //                     </div>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         ))
    //     ) : (
    //         JSON.stringify(categorySorted)
    //     )} 
    //     </div>
    // </div>