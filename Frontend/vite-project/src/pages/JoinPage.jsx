import { useState } from "react"; // Ye line add karo
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
    <div className="min-h-screen bg-base-300 text-white p-4 md:p-10 flex flex-col items-center">
      {/* APP TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-cyan-400 text-center">
        CodeTogether
      </h1>
      
      <div className="w-full max-w-lg">
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



//  undersant the replace button bhai and bhai ab leetcode ko bhi fir se strtt kr or deply kr usko
// yarr important hai bhai vo karna bhai 