import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-16">
      <h1 className="text-gray-300 text-shadow-xl text-3xl">Wähle dein Team</h1>
      <div className="flex gap-6 w-3/4 flex-wrap">
        <Link
          href="/pixelpiraten"
          className="w-full bg-[#4b0082] px-4 py-2 text-center rounded-lg shadow-md"
        >
          <p className="text-white text-xl">Die Pixel-Piraten</p>
        </Link>
        <Link
          href="/blitzbirnen"
          className="w-full bg-[#4b0082] px-4 py-2 text-center rounded-lg shadow-md"
        >
          <p className="text-white text-xl">Die Blitzbirnen</p>
        </Link>
        <Link
          href="/denkdinos"
          className="w-full bg-[#4b0082] px-4 py-2 text-center rounded-lg shadow-md"
        >
          <p className="text-white text-xl">Die Denk-Dinos</p>
        </Link>
      </div>
    </div>
  );
}
