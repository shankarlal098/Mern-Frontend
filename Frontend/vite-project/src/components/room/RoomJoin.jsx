
// export default function RoomJoin({
//   room,
//   setRoom,
//   joinRoom,
//   createRoom
// }) {
//   return (
//     <div className="rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">

//       <div className="p-8">

//         {/* Title */}

//         <h2 className="text-3xl font-bold text-white text-center">
//           Join a Room
//         </h2>

//         <p className="mt-2 text-center text-[#8b949e]">
//           Enter an existing room ID or create a new one.
//         </p>

//         {/* Input */}

//         <div className="mt-8">

//           <label className="mb-2 block text-sm font-medium text-[#c9d1d9]">
//             Room ID
//           </label>

//           <input
//             type="text"
//             placeholder="example : x82jd1"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//             className="
//               w-full
//               rounded-lg
//               border
//               border-[#30363d]
//               bg-[#0d1117]
//               px-4
//               py-3
//               text-white
//               placeholder:text-[#6e7681]
//               outline-none
//               transition
//               focus:border-[#58a6ff]
//             "
//           />

//         </div>

//         {/* Buttons */}

//         <div className="mt-8 flex flex-col gap-4">

//           <button
//             onClick={joinRoom}
//             className="
//               rounded-lg
//               bg-[#238636]
//               px-4
//               py-3
//               font-semibold
//               text-white
//               transition
//               hover:bg-[#2ea043]
//             "
//           >
//             Join Room
//           </button>

//           <button
//             onClick={createRoom}
//             className="
//               rounded-lg
//               border
//               border-[#30363d]
//               bg-[#21262d]
//               px-4
//               py-3
//               font-semibold
//               text-[#c9d1d9]
//               transition
//               hover:bg-[#30363d]
//             "
//           >
//             Create Random Room
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }


export default function RoomJoin({
  room,
  setRoom,
  joinRoom,
  createRoom
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1117]/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">
          Join Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter an existing room ID or generate a new workspace.
        </p>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Room ID
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="e.g. dev-x82jd1"
            value={room}
            onKeyDown={handleKeyDown}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
          />
          {room && (
            <button
              onClick={() => setRoom("")}
              className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {/* Join Button */}
        <button
          onClick={joinRoom}
          disabled={!room.trim()}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
        >
          <span>Join Room</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>

        <div className="relative my-1 flex items-center justify-center">
          <div className="w-full border-t border-slate-800/80"></div>
          <span className="absolute bg-[#0d1117] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            or
          </span>
        </div>

        <button
          onClick={createRoom}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Instant Room</span>
        </button>
      </div>
    </div>
  );
}