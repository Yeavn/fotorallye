import { FaVideo } from "react-icons/fa";

export default function VideoTask({
  team,
  task,
}: {
  team: string;
  task: string;
}) {
  return (
    <div className="w-full bg-indigo-400 py-4 rounded-lg shadow-lg flex items-center">
      <p className="text-white w-full p-2">{task}.</p>
      <label className="cursor-pointer m-0 p-0">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={() => {}}
        />
        <FaVideo className="text-white text-6xl p-2" />
      </label>
    </div>
  );
}
