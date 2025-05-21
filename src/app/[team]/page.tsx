"use client";

import { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import FotoTask from "./fotoTask";
import VideoTask from "./videoTask";
import aufgaben from "./aufgaben.json";

export default function Team({ params }: { params: { team: string } }) {
  const [isStarted, setIsStarted] = useState(true);
  const { team } = params;
  type TeamData = {
    id: number;
    team_id: string;
    team_name: string;
    punkte: number;
    aufgaben: number[];
  };
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/teams?team_id=${team}`);
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Teamdaten");
        }
        const data = await response.json();
        setTeamData(data[0] || null); // <-- Array-Handling
        if (!data[0]) {
          alert("Team nicht gefunden");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Teamdaten:", error);
        alert("Fehler beim Abrufen der Teamdaten");
      }
    };
    fetchTeamData();
  }, [team]);

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-gray-300 text-xl mt-2">Macht euch bereit!</h1>
        <h1 className="text-gray-300 text-xl mt-2">
          Das Spiel startet in kürze!
        </h1>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-gray-300 text-xl mt-2">Lade Teamdaten...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-gray-300 text-xl mt-2">Team {teamData.team_name}</h1>
      <h1 className="text-gray-300 text-xl mt-2">
        <GiGoldBar className="inline text-3xl" /> - {teamData.punkte}
      </h1>
      <div className="mt-8 w-5/6">
        <h1 className="text-gray-300 text-lg inline-block">
          <FaTasks className="inline mr-2" />
          Aufgaben
        </h1>
        <div className="flex mt-4 flex-wrap gap-4">
          {aufgaben.map(({ id, task }) => {
            return (
              <FotoTask
                key={id}
                taskId={id}
                team={team}
                task={task}
                teamData={teamData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
