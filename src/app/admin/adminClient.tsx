"use client";

import { useEffect, useRef, useState } from "react";

export default function AdminClient()  {

    const [isLoggeIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://88.214.56.148:3001")
        socketRef.current.onopen = () => {
            console.log('✅ Verbindung hergestellt');
        };
        socketRef.current.onmessage = (event) => {
            if (event.data === "started" || event.data === "start") {
                setIsStarted(true);
            }
        }
        return () => {
            socketRef.current?.close();
        }
    }, [])

    

    const sendStartSignal = () => {
        socketRef.current?.send("start");
        setIsStarted(true);
    }

    const sendStopSignal = () => {
        socketRef.current?.send("stop");
        setIsStarted(false);
    }

    const login = () => {
        if (password === "admin") {
            setIsLoggedIn(true);
        }
    }

    if (!isLoggeIn) {
        return (
            <div className="bg-gray-800 text-white h-screen flex flex-col items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <h1 className="font-bold text-3xl">Login</h1>
                    <input type="password" className="bg-gray-600 rounded-lg shadow-lg py-1 px-2 mt-6 border-none outline-none appearance-none text-lg focus:ring-2 ring-indigo-400 transition-all duration-200" onChange={(e) => setPassword(e.target.value)} />
                    <button className="bg-indigo-400 py-2 px-6 rounded-lg shadow-lg mt-6 hover:bg-indigo-500 transition-all duration-200" onClick={() => login()}>Bestätigen</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-gray-800 text-white h-screen flex flex-col items-center">
                <div className="flex flex-col w-5/6">
                    <h1 className="font-bold text-3xl mt-8">Admin Panel</h1>
                    <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex mt-8 w-2/5 flex-wrap">
                        <h1 className="text-xl w-full">Spieleinstellungen</h1>
                        {isStarted ? <button className="bg-red-800 py-2 px-6 rounded-lg shadow-lg mt-6 w-2/5" onClick={() => sendStopSignal()}>Spiel stoppen</button> :  <button className="bg-green-800 py-2 px-6 rounded-lg shadow-lg mt-6 w-1/4" onClick={() => sendStartSignal()}>Spiel starten</button>}
                        <br></br>
                        <p className="w-full mt-4 text-lg">Restzeit: 45min</p>
                    </div>
                </div>
            </div>
        )
    }
}