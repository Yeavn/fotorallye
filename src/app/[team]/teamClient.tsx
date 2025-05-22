"use client";

import "./loader.css"; // Import your CSS file here

import { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import FotoTask from "./fotoTask";
import aufgaben from "./aufgaben.json";


type TeamData = {
  id: number;
  team_id: string;
  team_name: string;
  punkte: number;
  aufgaben: number[];
};

export default function TeamClient({ team }: { team: string }) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [startText, setStartText] = useState("bald!");
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/teams?team_id=${team}`);
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Teamdaten");
        }
        const data = await response.json();
        setTeamData(data[0] || null);
        if (!data[0]) {
          alert("Team nicht gefunden");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Teamdaten:", error);
        alert("Fehler beim Abrufen der Teamdaten");
      }
    };
    fetchTeamData()

    const socket = new WebSocket("ws://88.214.56.148:3001");
    socket.onopen = () => {
      console.log('✅ Verbindung hergestellt');
    };
    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      if (event.data === "start") {
        setStartText("in 3.");
        setTimeout(() => setStartText("in 2."), 1000);
        setTimeout(() => setStartText("in 1."), 2000);
        setTimeout(() => setIsStarted(true), 3000)
      } else if (event.data === "stop") {
        setStartText("bald!");
        setIsStarted(false);
      } else if (event.data === "started") {
        setIsStarted(true);
      }
    };
  }, []);

  const handlePointsAdded = (punkte: number) => {
    setTeamData((prev) =>
      prev ? { ...prev, punkte: prev.punkte + punkte } : prev
    );
  };

  if (!teamData) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  if(!isStarted) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 justify-center">
        <h1 className="text-gray-300 text-xl mt-2">Macht euch bereit!</h1>
        <h1 className="text-gray-300 text-xl mt-2">Das Spiel startet {startText}</h1>
        <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGdzbHhvZHM2YTdhcTZndGk4Nzk5NGo5bDJwZzN2NjgwZDl3dmlrOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif" alt="" className="w-3/4 mt-4 rounded-lg shadow-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="relative w-full text-white">
        <div
          className="w-full bg-[#4b0082] text-center py-6 text-xl font-bold shadow-lg"
          style={{
            clipPath: 'polygon(15% 100%, 85% 100%, 100% 0, 0 0)',
          }}
        >
          Team {teamData.team_name}
        </div>
      </div>
      <div className="flex items-center mt-4 w-3/5 justify-between">
        <h1 className="text-white text-2xl">45 min</h1>
        <h1 className="text-white text-2xl flex items-center gap-1">
          {teamData.punkte} <GiGoldBar className="inline text-3xl" />
        </h1>
      </div>
      <div className="mt-8 w-5/6">
        <h1 className="text-gray-300 text-lg inline-block">
          <FaTasks className="inline mr-2" />
          Aufgaben
        </h1>
        <div className="flex mt-4 flex-wrap gap-4">
          {aufgaben.map(({ id, task }) => (
            <FotoTask
              key={id}
              taskId={id}
              team={team}
              task={task}
              teamData={teamData}
              onPointsAdded={handlePointsAdded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
