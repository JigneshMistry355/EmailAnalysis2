'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";


export default function Header() {
    // const [token, setToken] = useState<string | null>(null)
    const { token, logout, goToLogin} = useAuth();
    const router = useRouter();
    
    // const handleLogout = () => {
       
    //     localStorage.removeItem("token");
    //     setToken(null)
    //     router.push("/");
    // }

    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token");
    //     setToken(storedToken);

    //     const handleStorageChange = () => {
    //         setToken(localStorage.getItem("token"));
    //     };
    //     window.addEventListener("storage", handleStorageChange);

    //     return () => {
    //         window.removeEventListener("storage", handleStorageChange);
    //     }; 
    // }, []);
    
    return (
        <>
            <div className="relative bg-gradient-to-b from-black from-10% via-black via-50% to-emerald-800 to-90% py-8">
                <div>
                    <h1 className="scale-150  animate-slideIn text-white text-center font-[fantasy] antialiased tracking-wide italic text-4xl">EMAIL AUTOMATION</h1>
                </div>
                <div className="absolute right-4 bottom-8 ">
                    
                        { token ? (  
                            <button 
                                className="min-w-24 min-h-8 px-2 items-center justify-center text-center ring-2 ring-slate-100 shadow-md shadow-green-400 bg-gray-200 rounded-md font-[serif] font-bold tacking-wide italic hover:bg-slate-300"
                                onClick={logout}
                            >
                                Logout
                            </button>
                         ) : (
                            <button 
                                className="min-w-24 min-h-8 px-2 items-center justify-center text-center ring-2 ring-slate-100 shadow-md shadow-green-400 bg-gray-200 rounded-md font-[serif] font-bold tacking-wide italic hover:bg-slate-300"
                                onClick={goToLogin}
                                >
                                Login
                            </button>
                        )
                        }
                    
                </div>
            </div>
        </>
    );
}

