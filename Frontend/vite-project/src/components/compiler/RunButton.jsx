export default function RunButton({
  runButton,
  runCode,
}) {

  const isRunning =
    runButton === "Running...";

  return (

    <button
      onClick={runCode}
      disabled={isRunning}
      className="
        flex
        min-w-[120px]
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-[#238636]
        px-5
        py-2
        font-medium
        text-white
        transition
        hover:bg-[#2ea043]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >

      {isRunning && (
        <span className="loading loading-spinner loading-sm"></span>
      )}

      {runButton}

    </button>

  );
}