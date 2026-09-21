// export default function InputPanel({
//   input,
//   setInput,
// }) {
//   return (
//     <div className="w-full rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">

//       <div className="border-b border-[#30363d] px-5 py-4">
//         <h2 className="text-lg font-semibold text-white">
//           Custom Input
//         </h2>

//         <p className="mt-1 text-sm text-gray-400">
//           Input passed to your program
//         </p>
//       </div>

//       <div className="p-4">

//         <textarea
//           value={input}
//           onChange={(e) =>
//             setInput(e.target.value)
//           }
//           placeholder="Enter custom input..."
//           className="
//             h-[120px]
//             w-full
//             resize-none
//             rounded-lg
//             border
//             border-[#30363d]
//             bg-[#0d1117]
//             p-3
//             text-gray-100
//             placeholder:text-gray-500
//             outline-none
//             transition
//             focus:border-[#58a6ff]
//             focus:ring-1
//             focus:ring-[#58a6ff]
//           "
//         />

//       </div>

//     </div>
//   );
// }




export default function InputPanel({ input, setInput }) {
  return (
    <div className="w-full">
      <div className="mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Custom Input
        </h2>
        <p className="text-[11px] font-medium text-slate-500">
          Passed to standard input (stdin)
        </p>
      </div>

      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter custom input..."
          className="h-[120px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 scrollbar-thin scrollbar-thumb-slate-800"
        />
      </div>
    </div>
  );
}