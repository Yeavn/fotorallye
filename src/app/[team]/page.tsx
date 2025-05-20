"use client";

import React from "react";
import { FaTasks } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import FotoTask from "./fotoTask";
import VideoTask from "./videoTask";

export default function Team({ params }: { params: { team: string } }) {
  const { team } = params;
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-gray-300 text-xl mt-2">Team {team}</h1>
      <h1 className="text-gray-300 text-xl mt-2">
        <GiGoldBar className="inline text-3xl" /> - 0
      </h1>
      <div className="mt-8 w-5/6">
        <h1 className="text-gray-300 text-lg inline-block">
          <FaTasks className="inline mr-2" />
          Aufgaben
        </h1>
        <div className="flex mt-4 flex-wrap gap-4">
          <FotoTask
            key={1}
            team={team}
            task="Findet einen Gegenstand in allen Regenbogenfarben"
          />
          <VideoTask
            team={team}
            task="Findet einen Gegenstand in allen Regenbogenfarben"
          />
        </div>
      </div>
    </div>
  );
}
