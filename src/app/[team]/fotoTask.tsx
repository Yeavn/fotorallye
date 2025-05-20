import { useState } from "react";
import { FaCamera } from "react-icons/fa";

export default function FotoTask({
  key,
  team,
  task,
}: {
  key: number;
  team: string;
  task: string;
}) {
  const [isSet, setIsSet] = useState(false);

  // Bild-Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key.toString());

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setIsSet(true);
    } catch (err) {
      alert("Fehler beim Hochladen!");
    }
  };

  return (
    <div
      className={
        isSet
          ? "w-full bg-green-700 py-4 rounded-lg shadow-lg flex items-center"
          : "w-full bg-indigo-400 py-4 rounded-lg shadow-lg flex items-center"
      }
    >
      <p className="text-white w-full p-2">{task}.</p>
      <label className="cursor-pointer m-0 p-0">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <FaCamera className="text-white text-6xl p-2" />
      </label>
    </div>
  );
}
