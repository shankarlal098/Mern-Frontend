export default function ChatMessage({ msg }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 transition-colors hover:border-[#58a6ff]/40">

      {/* Header */}
      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#238636] text-sm font-bold text-white">
          {msg.username?.charAt(0).toUpperCase()}
        </div>

        <span className="font-semibold text-[#58a6ff]">
          {msg.username}
        </span>

      </div>

      {/* Message */}
      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#c9d1d9]">
        {msg.text}
      </p>

    </div>
  );
}