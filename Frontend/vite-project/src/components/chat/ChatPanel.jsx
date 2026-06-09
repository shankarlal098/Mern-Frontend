import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";

export default function ChatPanel({ messages, message, setMessage, sendMessage }) {
  const scrollRef = useRef(null); // Parent container ko target karenge

  useEffect(() => {
    // scrollRef.current.scrollHeight poori height nikal lega 
    // aur scrollTop ko wahan set kar dega
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); // Har naye message pe ye chalega

  return (
    <div className="w-full h-[400px] lg:h-[500px] bg-base-200 border border-cyan-500 rounded-2xl shadow-xl flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-cyan-500">
        <h2 className="text-2xl font-semibold text-cyan-400">Room Chat</h2>
      </div>
      
      {/* MESSAGES - Yahan ref add kiya hai */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {messages.map((msg, index) =>
          msg.system ? (
            <div key={index} className="text-center text-xs text-cyan-400 italic">
              {msg.text}
            </div>
          ) : (
            <ChatMessage key={index} msg={msg} />
          )
        )}
      </div>
      
      {/* INPUT AREA */}
      <div className="p-4 border-t border-cyan-500 flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Optional: Enter dabane pe bhi send ho
          onChange={(e) => setMessage(e.target.value)}
          className="input input-bordered input-info flex-1 w-full"
        />
        <button onClick={sendMessage} className="btn btn-info text-black">
          Send
        </button>
      </div>
    </div>
  );
}