// export default function ChatMessage({ msg }) {
//   return (
//     <div className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 transition-colors hover:border-[#58a6ff]/40">

//       {/* Header */}
//       <div className="mb-2 flex items-center gap-2">

//         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#238636] text-sm font-bold text-white">
//           {msg.username?.charAt(0).toUpperCase()}
//         </div>

//         <span className="font-semibold text-[#58a6ff]">
//           {msg.username}
//         </span>

//       </div>

//       {/* Message */}
//       <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#c9d1d9]">
//         {msg.text}
//       </p>

//     </div>
//   );
// }



export default function ChatMessage({ msg }) {
  const initial = msg.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="group rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-800/40">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md border border-blue-400/20">
          {initial}
        </div>

        <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
          {msg.username}
        </span>
      </div>

      {/* Message Text */}
      <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-300">
        {msg.text}
      </p>
    </div>
  );
}