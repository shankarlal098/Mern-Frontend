import { useState } from "react";
import RoomJoin from "../components/room/RoomJoin";
import { useNavigate } from "react-router-dom";



export default function JoinPage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  function joinRoom() {
    if (!room.trim()) return;
    navigate(`/room/${room}`);
  }

  function createRoom() {
    const randomRoom = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${randomRoom}`);
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">

      <div className="w-full max-w-lg">

        <div className="mb-10 text-center">

          <h1 className="text-5xl font-bold text-white tracking-tight">
            Code<span className="text-[#58a6ff]">Together</span>
          </h1>

          <p className="mt-3 text-[#8b949e]">
            Real-time collaborative coding platform
          </p>

        </div>

        <RoomJoin
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
          createRoom={createRoom}
        />

      </div>

    </div>
  );
}