// export default function RunButton({
//   runButton,
//   runCode,
// }) {

//   const isRunning =
//     runButton === "Running...";

//   return (

//     <button
//       onClick={runCode}
//       disabled={isRunning}
//       className="
//         flex
//         min-w-[120px]
//         items-center
//         justify-center
//         gap-2
//         rounded-lg
//         bg-[#238636]
//         px-5
//         py-2
//         font-medium
//         text-white
//         transition
//         hover:bg-[#2ea043]
//         disabled:cursor-not-allowed
//         disabled:opacity-60
//       "
//     >

//       {isRunning && (
//         <span className="loading loading-spinner loading-sm"></span>
//       )}

//       {runButton}

//     </button>

//   );
// }


export default function RunButton({ runButton, runCode }) {
  const isRunning = runButton === "Running...";

  return (
    <button
      onClick={runCode}
      disabled={isRunning}
      className="flex h-9 min-w-[110px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-emerald-600/20"
    >
      {isRunning ? (
        <>
          <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Running...</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>{runButton}</span>
        </>
      )}
    </button>
  );
}