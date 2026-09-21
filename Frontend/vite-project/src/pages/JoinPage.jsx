// import { useState } from "react";
// import RoomJoin from "../components/room/RoomJoin";
// import { useNavigate } from "react-router-dom";



// export default function JoinPage() {
//   const [room, setRoom] = useState("");
//   const navigate = useNavigate();

//   function joinRoom() {
//     if (!room.trim()) return;
//     navigate(`/room/${room}`);
//   }

//   function createRoom() {
//     const randomRoom = Math.random().toString(36).substring(2, 8);
//     navigate(`/room/${randomRoom}`);
//   }

//   return (
//     <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">

//       <div className="w-full max-w-lg">

//         <div className="mb-10 text-center">

//           <h1 className="text-5xl font-bold text-white tracking-tight">
//             Code<span className="text-[#58a6ff]">Together</span>
//           </h1>

//           <p className="mt-3 text-[#8b949e]">
//             Real-time collaborative coding platform
//           </p>

//         </div>

//         <RoomJoin
//           room={room}
//           setRoom={setRoom}
//           joinRoom={joinRoom}
//           createRoom={createRoom}
//         />

//       </div>

//     </div>
//   );
// }




import { useState } from "react";
import RoomJoin from "../components/room/RoomJoin";
import { useNavigate } from "react-router";

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
    <div className="relative flex min-h-screen items-center justify-center bg-[#090d16] px-4 py-12 overflow-hidden selection:bg-blue-500 selection:text-white">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Collaboration
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Code<span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Together</span>
          </h1>

          <p className="mt-2.5 text-sm text-slate-400">
            Collaborative coding, live execution & voice channels in one room.
          </p>
        </div>

        <RoomJoin
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
          createRoom={createRoom}
        />

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Live Sync
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Voice RTC
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Code Compiler
          </span>
        </div>
      </div>
    </div>
  );
}