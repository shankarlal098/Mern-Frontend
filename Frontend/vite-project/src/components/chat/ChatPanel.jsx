import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";

export default function ChatPanel({
  messages,
  message,
  setMessage,
  sendMessage,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-[400px] lg:h-[500px] rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg flex flex-col overflow-hidden">

      {/* Header */}
      <div className="border-b border-[#30363d] px-5 py-4">
        <h2 className="text-lg font-semibold text-white">
          Room Chat
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Talk with everyone in the room
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#0d1117] p-4 space-y-3"
      >
        {messages.map((msg, index) =>
          msg.system ? (
            <div
              key={index}
              className="text-center text-xs italic text-gray-500"
            >
              {msg.text}
            </div>
          ) : (
            <ChatMessage
              key={index}
              msg={msg}
            />
          )
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#30363d] bg-[#161b22] p-4">
        <div className="flex items-center gap-3 w-full">

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            className="
              flex-1
              min-w-0
              rounded-lg
              border
              border-[#30363d]
              bg-[#0d1117]
              px-4
              py-2.5
              text-gray-100
              placeholder:text-gray-500
              outline-none
              transition
              focus:border-[#58a6ff]
              focus:ring-1
              focus:ring-[#58a6ff]
            "
          />

          <button
            onClick={sendMessage}
            className="
              shrink-0
              rounded-lg
              bg-[#238636]
              px-5
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-[#2ea043]
              active:scale-95
            "
          >
            Send
          </button>

        </div>
      </div>

    </div>
  );
}