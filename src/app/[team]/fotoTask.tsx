import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { supabase } from "../../../lib/supabase/client";

type TeamData = {
  id: number;
  team_id: string;
  team_name: string;
  punkte: number;
  aufgaben: number[];
};

export default function FotoTask({
  taskId,
  team,
  task,
  teamData,
  onPointsAdded,
}: {
  taskId: number;
  team: string;
  task: string;
  teamData: TeamData;
  onPointsAdded: (punkte: number) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [isSet, setIsSet] = useState(false);

  // Bild-Upload Handler
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const filePath = `public/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from(`fotorallye/${team}`)
      .upload(filePath, file);

    if (error) {
      alert("Fehler beim Hochladen: " + error.message);
    } else {
      supabase.storage.from("fotorallye").getPublicUrl(filePath);
    }

    await fetch("/api/teamUpload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team_id: team,
        task_id: taskId,
      }),
    });

    setUploading(false);
    setIsSet(true);
    if (onPointsAdded) {
      onPointsAdded(50);
    }
    
  };

  useEffect(() => {
    const checkIfSet = () => {
      teamData.aufgaben.forEach((aufgabe) => {
        if (aufgabe === taskId) {
          console.log("aufgabe gefunden", aufgabe);

          setIsSet(true);
        }
      });
    };
    checkIfSet();
  }, []);

  return (
    <div
      className={
        isSet
          ? "w-full bg-green-900 py-4 rounded-sm shadow-lg flex items-center"
          : "w-full bg-[#4b0082] py-4 rounded-sm shadow-lg flex items-center"
      }
    >
      {uploading ? (
        <p className="text-white w-full p-2">Datei wird hochgeladen...</p>
      ) : (
        <p className="text-white w-full p-2">{task}.</p>
      )}
      <label className="cursor-pointer m-0 p-0">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={uploadImage}
        />
        {isSet || uploading ? null : (
          <FaCamera className="text-white text-6xl p-2" />
        )}
      </label>
    </div>
  );
}
