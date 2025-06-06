"use client";

import { useEffect, useRef, useState } from "react";

export default function AdminClient()  {

    const [isLoggeIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [time, setTime] = useState(60)
    type Team = {
        team_id?: string;
        team_name?: string;
        name?: string;
        punkte?: number;
        [key: string]: any;
    };
    const [teamData, setTeamData] = useState<Team[]>([])
    const socketRef = useRef<WebSocket | null>(null);

    const fetchTeamData = async () => {
        try {
            const response = await fetch("/api/getTeams")
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen der Teamdaten");
            }
            const data = await response.json();
            setTeamData(data || null);
        } catch (error) {
            console.error("Fehler beim Abrufen der Teamdaten:", error);
            alert("Fehler beim Abrufen der Teamdaten");
        }
    }

    useEffect(() => {
        socketRef.current = new WebSocket("ws://217.154.200.205:3001")
        socketRef.current.onopen = () => {
            console.log('✅ Verbindung hergestellt');
        };
        socketRef.current.onmessage = (event) => {
            let message;
            try {
                message = JSON.parse(event.data);
            } catch {
                message = event.data;
            }
            if (message.type === "time") {
                setTime(message.value);
            }
            if (message=== "started" || message === "start") {
                setIsStarted(true);
            }
        }
        return () => {
            socketRef.current?.close();
        }
    }, [])

    useEffect(() => {
        fetchTeamData()
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
            <div className="bg-gray-800 text-white min-h-screen flex flex-row justify-center gap-4">
                <div className="flex flex-col w-5/6">
                    <h1 className="font-bold text-3xl mt-8">Admin Panel</h1>
                    <div className="bg-gray-900 p-8 h-auto rounded-lg shadow-lg flex mt-8 flex-wrap">
                        <h1 className="text-xl w-full">Spieleinstellungen</h1>
                        {isStarted ? <button className="bg-red-800 py-2 px-6 rounded-lg shadow-lg mt-6 w-2/5" onClick={() => sendStopSignal()}>Spiel stoppen</button> :  <button className="bg-green-800 py-2 px-6 rounded-lg shadow-lg mt-6 w-1/4" onClick={() => sendStartSignal()}>Spiel starten</button>}
                        <br></br>
                        <p className="w-full mt-4 text-lg">Restzeit: {time}min</p>
                    </div>
                    <div className="bg-gray-900 p-8 h-auto rounded-lg shadowlg flex mt-8 flex-wrap">
                        <div className="bg-gray-900 p-8 h-auto rounded-lg shadowlg flex flex-wrap w-full justify-between items-center">
                            <h1 className="text-xl w-1/12 mb-4">Teams</h1>
                            <div className="w-11/12 mb-4">
                                <button className="px-2 py-4 bg-indigo-400 rounded-lg shadow-lg" onClick={fetchTeamData}>Neu laden</button>
                            </div>
                            {Array.isArray(teamData) && teamData.map((team, idx) => (
                            <div key={idx} className="bg-gray-800 rounded p-4 w-full md:w-1/4 shadow">
                                <h2 className="font-bold text-lg mb-2">{team.team_name || team.name || `Team ${idx+1}`}</h2>
                                <p><b>ID:</b> {team.team_id}</p>
                                <p><b>Aufgaben:</b> {team.aufgaben.length}</p>
                                
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}