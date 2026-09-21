// import ChatMessage from "./ChatMessage";
// import { useEffect, useRef } from "react";

// export default function ChatPanel({
//   messages,
//   message,
//   setMessage,
//   sendMessage,
// }) {
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop =
//         scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="w-full h-[400px] lg:h-[500px] rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg flex flex-col overflow-hidden">

//       {/* Header */}
//       <div className="border-b border-[#30363d] px-5 py-4">
//         <h2 className="text-lg font-semibold text-white">
//           Room Chat
//         </h2>

//         <p className="mt-1 text-sm text-gray-400">
//           Talk with everyone in the room
//         </p>
//       </div>

//       {/* Messages */}
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto bg-[#0d1117] p-4 space-y-3"
//       >
//         {messages.map((msg, index) =>
//           msg.system ? (
//             <div
//               key={index}
//               className="text-center text-xs italic text-gray-500"
//             >
//               {msg.text}
//             </div>
//           ) : (
//             <ChatMessage
//               key={index}
//               msg={msg}
//             />
//           )
//         )}
//       </div>

//       {/* Input */}
//       <div className="border-t border-[#30363d] bg-[#161b22] p-4">
//         <div className="flex items-center gap-3 w-full">

//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={message}
//             onChange={(e) =>
//               setMessage(e.target.value)
//             }
//             onKeyDown={(e) =>
//               e.key === "Enter" && sendMessage()
//             }
//             className="
//               flex-1
//               min-w-0
//               rounded-lg
//               border
//               border-[#30363d]
//               bg-[#0d1117]
//               px-4
//               py-2.5
//               text-gray-100
//               placeholder:text-gray-500
//               outline-none
//               transition
//               focus:border-[#58a6ff]
//               focus:ring-1
//               focus:ring-[#58a6ff]
//             "
//           />

//           <button
//             onClick={sendMessage}
//             className="
//               shrink-0
//               rounded-lg
//               bg-[#238636]
//               px-5
//               py-2.5
//               font-medium
//               text-white
//               transition
//               hover:bg-[#2ea043]
//               active:scale-95
//             "
//           >
//             Send
//           </button>

//         </div>
//       </div>

//     </div>
//   );
// }



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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-[380px] lg:h-[420px] rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 shadow-lg backdrop-blur-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800/80 px-4 py-3 bg-slate-900/40 shrink-0">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Room Chat</span>
        </h2>
        <p className="text-[11px] font-medium text-slate-400">
          Messages are synced with all room members
        </p>
      </div>

      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#090d16]/40 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {messages.map((msg, index) =>
          msg.system ? (
            <div
              key={index}
              className="my-1.5 text-center text-[11px] font-medium text-slate-500 bg-slate-900/40 py-1 px-3 rounded-full border border-slate-800/40 w-fit mx-auto"
            >
              {msg.text}
            </div>
          ) : (
            <ChatMessage key={index} msg={msg} />
          )
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/80 bg-slate-900/40 p-3 shrink-0">
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 min-w-0 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80"
          />

          <button
            onClick={sendMessage}
            className="shrink-0 flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}