export default function InputPanel({ input, setInput }) {
  return (
    <div className="mt-5 w-full">
      <h2 className="text-lg font-semibold text-cyan-400 mb-2">
        Custom Input
      </h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input here..."
        className="textarea textarea-bordered textarea-info w-full h-[100px] md:h-[140px] bg-base-200"
      />
    </div>
  );
}