'use client'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";


export default function Login() {

  const { token, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const router = useRouter();

  
  // const api = axios.create({
  //   baseURL: 'http://localhost:8000',
  // });

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      // Your client-side code here
    }
    
    console.log("TOKEN CHECK :::::::::::::::::::::::::", token);

  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("")
    try{
      await login(username, password);
      router.push('/dashboard');
    }catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail || "Login failed");
        console.log(error.status);
        alert("Login Failed");
      }else {
        setError("Network error");
        alert("Login failed");
      }
    }
  }

  const handleKeyDown = async (event:any) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      await handleLogin(event as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex h-screen min-w-fit items-center justify-center bg-login-background bg-cover bg-center font-mono">
        <div className="bg-gray-200 shadow-2xl w-1/3 min-w-fit text-center items-center px-16 py-8 rounded-md justify-center">
          <h1>Login</h1>
          <div className="flex-col justify-center opacity-100 my-2">
            <div className="w-full p-0">   
              <input 
                type="text" 
                placeholder="Username" 
                name="username" 
                id="username" 
                className="border-2 border-gray-500 rounded-sm p-0.5 w-full my-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                name="password" 
                id="password" 
                className="border-2 border-gray-500 rounded-sm p-0.5 w-full my-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                />
            </div>
            
          </div>
          <div>
              <button className="rounded-sm w-full bg-gray-500 text-white px-2 py-1 hover:bg-gray-700" onClick={handleLogin}>Submit</button>
            </div>
        </div>
    </div>
  );
}
