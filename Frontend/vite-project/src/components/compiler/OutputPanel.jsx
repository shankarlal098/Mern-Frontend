// export default function OutputPanel({ output }) {
//   return (
//     <div className="w-full rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">

//       <div className="border-b border-[#30363d] px-5 py-4">
//         <h2 className="text-lg font-semibold text-white">
//           Output
//         </h2>

//         <p className="mt-1 text-sm text-gray-400">
//           Program execution result
//         </p>
//       </div>

//       <div className="p-4">
//         <pre className="min-h-[130px] max-h-[320px] overflow-auto rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#7ee787] whitespace-pre-wrap">
//           {output || "Run your code to see output..."}
//         </pre>
//       </div>

//     </div>
//   );
// }




export default function OutputPanel({ output }) {
  return (
    <div className="w-full">
      <div className="mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Execution Output
        </h2>
        <p className="text-[11px] font-medium text-slate-500">
          Standard output & errors
        </p>
      </div>

      <div>
        <pre className="min-h-[120px] max-h-[280px] overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
          {output || "Run your code to see output..."}
        </pre>
      </div>
    </div>
  );
}