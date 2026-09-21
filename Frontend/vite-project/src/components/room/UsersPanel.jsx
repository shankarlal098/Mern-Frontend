// import React from "react";

// export default function UsersPanel({
//   users,
//   typingUser,
//   ownerUserId,
//   myRole,
//   currentUserId,
//   onKick,
// }) {

//     const onlineUsers = new Set(
//         users
//           .filter((user) => user.online)
//           .map((user) => user.userId?.toString())
//       ).size;

//     const totalUsers = new Set(
//       users.map((user) => user.userId?.toString())
//     ).size;
//   return (
//     <div className="w-full rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">
//       {/* Header */}
//       <div className="border-b border-[#30363d] px-5 py-4">
//         <h2 className="text-lg font-semibold text-white">
//           Users
//         </h2>

//         <p className="mt-1 text-sm text-gray-400">
//           {onlineUsers} Online • {totalUsers} Total
//         </p>
//       </div>

//       {/* Users */}
//       <div className="max-h-[420px] overflow-y-auto p-4 space-y-3">

//         {users.map((u) => (
//           <div
//             key={u.userId}
//             className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 transition-all duration-200 hover:border-[#58a6ff] hover:bg-[#161b22]"
//           >
//             <div className="flex items-center gap-3 overflow-hidden">

//               {/* Status Dot */}
//               <span
//                 className={`h-3 w-3 rounded-full shrink-0 ${
//                   u.online
//                     ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
//                     : "bg-gray-600"
//                 }`}
//               />

//               <div className="min-w-0">

//                 <div className="flex flex-wrap items-center gap-2">

//                   <span className="truncate font-medium text-gray-100">
//                     {u.username}
//                   </span>

//                   {u.userId?.toString() === ownerUserId?.toString() && (
//                     <span className="rounded bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-300">
//                       👑 Host
//                     </span>
//                   )}

//                   {u.role === "editor" &&
//                     u.userId?.toString() !== ownerUserId?.toString() && (
//                       <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs text-blue-300">
//                         ✏ Editor
//                       </span>
//                     )}

//                   {u.role === "viewer" && (
//                     <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
//                       👁 Viewer
//                     </span>
//                   )}
//                 </div>

//                 {typingUser === u.username && (
//                   <p className="mt-1 text-xs text-green-400 animate-pulse">
//                     typing...
//                   </p>
//                 )}

//                 {!u.online && (
//                   <p className="mt-1 text-xs text-gray-500">
//                     Offline
//                   </p>
//                 )}
//               </div>
//             </div>

//            {myRole === "admin" &&
//               u.userId?.toString() !== currentUserId?.toString() &&
//               u.role !== "admin" && (
//                 <button
//                   onClick={() => onKick(u)}
//                   className="rounded-md border border-red-500 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
//                 >
//                   Kick
//                 </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // // isme grouping baki hai vo doicks wali like shankar (4) wali types 





import React from "react";

export default function UsersPanel({
  users,
  typingUser,
  ownerUserId,
  myRole,
  currentUserId,
  onKick,
}) {
  const onlineUsers = new Set(
    users
      .filter((user) => user.online)
      .map((user) => user.userId?.toString())
  ).size;

  const totalUsers = new Set(
    users.map((user) => user.userId?.toString())
  ).size;

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 shadow-lg backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3.5 bg-slate-900/40">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Members</span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
              {totalUsers}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-400">
            {onlineUsers} Online
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="max-h-[300px] overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
        {users.map((u) => (
          <div
            key={u.userId}
            className="group flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/40 p-2.5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* User Avatar with Status Dot */}
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-bold text-slate-200 border border-slate-700/50">
                  {u.username?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d1117] ${
                    u.online
                      ? "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-xs font-semibold text-slate-200 group-hover:text-white">
                    {u.username}
                  </span>

                  {u.userId?.toString() === ownerUserId?.toString() && (
                    <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                      👑 Host
                    </span>
                  )}

                  {u.role === "editor" &&
                    u.userId?.toString() !== ownerUserId?.toString() && (
                      <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
                        ✏ Editor
                      </span>
                    )}

                  {u.role === "viewer" && (
                    <span className="rounded-md bg-slate-800 border border-slate-700/50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                      👁 Viewer
                    </span>
                  )}
                </div>

                {typingUser === u.username && (
                  <p className="mt-0.5 text-[10px] font-medium text-emerald-400 animate-pulse">
                    typing...
                  </p>
                )}

                {!u.online && (
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    Offline
                  </p>
                )}
              </div>
            </div>

            {myRole === "admin" &&
              u.userId?.toString() !== currentUserId?.toString() &&
              u.role !== "admin" && (
                <button
                  onClick={() => onKick(u)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-500/50 active:scale-[0.98]"
                >
                  Kick
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}