'use client'
import React, {createContext, useContext, useEffect, useState, ReactNode} from "react";
import axios from "axios";
import {  usePathname, useRouter } from "next/navigation";
import { headers } from "next/headers";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    goToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();


    const api = axios.create({
        baseURL: "http://localhost:8000"
    });

    const login = async (username: string, password: string) => {

        try{
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);
            const response = await api.post('/token', formData, {headers: {"Content-Type": "application/x-www-form-urlencoded"}});
            console.log("JWT response data:::::::::::::",response.data.access_token);
            const storedToken = response.data.access_token;
            setToken(storedToken);
            localStorage.setItem("token", storedToken);
            await fetchUser(response.data.access_token);

        } catch (error: any) {
            if (error.response) {
                console.log(error.status);
                alert("Login Failed");
            }else {
                alert("Login failed");
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        router.push('/');
    } 

    const goToLogin = () => {
        router.push('/Login');
    }

    const fetchUser = async (token: string) => {
        try {
            const response = await api.get('/users/me/', {headers: { Authorization: `Bearer ${token}`}});
            setUser(response.data);
        }catch {
            logout();
        }
    }
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
    },[])

    return (
        <AuthContext.Provider value={{user, token, login, logout, goToLogin}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

    
