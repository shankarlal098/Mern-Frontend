// import { useRef } from "react";

// export default function VoicePanel({
//   onStartVoice,
//   handleJoinVoice,
//   onLeaveVoice,

//   voiceActive,
//   voiceUsers,

//   sessionId,
//   connectionStates,

//   remoteStreamsState,

//   isMuted,
//   toggleMute,
//   isStarting,
//   setIsStarting,
//   isJoiningVoice
// }) {
//   // ============================================
//   // REMOTE AUDIO ELEMENT REFERENCES
//   // ============================================

//   const remoteAudioRefs = useRef(new Map());

//   // ============================================
//   // CURRENT SESSION VOICE ME JOINED?
//   // ============================================

//   const isJoined = voiceUsers?.some(
//     (voiceUser) =>
//       voiceUser.sessionId === sessionId
//   );



 
//   // ============================================
//   // WEBRTC CONNECTION STATUS
//   // ============================================

//   const states = Object.values(
//     connectionStates || {}
//   );

//   const isConnected =
//     states.length > 0 &&
//     states.every(
//       (state) => state === "connected"
//     );

//   const isConnecting = states.some(
//                     (state) =>
//                       state === "new" ||
//                       state === "connecting"
//                   );

//   // ============================================
//   // AVATAR INITIAL
//   // ============================================

//   const getInitial = (username) => {
//     return (
//       username?.charAt(0)?.toUpperCase() || "?"
//     );
//   };


  
//   return (
//     <div className="overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">

//       {/* =========================================
//           HEADER
//       ========================================== */}

//       <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-4">

//         <div>
//           <h2 className="text-lg font-semibold text-white">
//             Voice Chat
//           </h2>

//           <p className="mt-1 text-xs text-gray-400">
//             Real-time room audio
//           </p>
//         </div>

//         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#21262d] text-lg">
//           🎙️
//         </div>

//       </div>


//       {/* =========================================
//           BODY
//       ========================================== */}

//       <div className="px-5 py-5">

//         {/* =======================================
//             VOICE NOT STARTED
//         ======================================== */}

//         {!voiceActive && (

//           <div className="flex flex-col items-center py-3">

//             <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#21262d] text-2xl">
//               🎙️
//             </div>

//             <p className="mb-4 text-sm text-gray-400">
//               Start a voice chat for this room
//             </p>

//             <button
//                 onClick={onStartVoice}
//                 disabled={isStarting}
//                 className={`
//                     w-full rounded-lg px-4 py-2.5
//                     text-sm font-medium text-white
//                     transition

//                     ${
//                         isStarting
//                             ? "bg-green-800 cursor-not-allowed opacity-60"
//                             : "bg-green-600 hover:bg-green-500 active:scale-[0.98]"
//                     }
//                 `}>
//                   {isStarting
//                       ? "Starting..."
//                       : "🎙️ Start Voice"}
//             </button>

//           </div>

//         )}


//         {/* =======================================
//             VOICE ACTIVE
//         ======================================== */}

//         {voiceActive && (

//           <>

//             {/* ===================================
//                 PARTICIPANTS
//             ==================================== */}

//             <div>

//               <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
//                 Participants
//               </p>

//               <div className="flex flex-wrap gap-4">

//                 {voiceUsers?.map((voiceUser) => (

//                   <div
//                     key={voiceUser.sessionId}
//                     className="flex min-w-[64px] flex-col items-center"
//                   >

//                     {/* Avatar */}

//                     <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3b434d] bg-[#21262d] text-sm font-semibold text-white">

//                       {getInitial(
//                         voiceUser.username
//                       )}

//                     </div>


//                     {/* Username */}

//                     <span className="mt-1.5 max-w-[75px] truncate text-xs text-gray-400">

//                       {voiceUser.username}

//                     </span>

//                   </div>

//                 ))}

//               </div>

//             </div>


//             {/* ===================================
//                 REMOTE AUDIO
//             ==================================== */}

//             <div className="hidden">

//               {Object.entries(
//                 remoteStreamsState || {}
//               ).map(
//                 ([targetSessionId, stream]) => (

//                   <audio
//                     key={targetSessionId}
//                     autoPlay
//                     playsInline

//                     ref={(audio) => {

//                       if (!audio) {

//                         remoteAudioRefs.current.delete(
//                           targetSessionId
//                         );

//                         return;
//                       }


//                       // Save audio element reference

//                       remoteAudioRefs.current.set(
//                         targetSessionId,
//                         audio
//                       );


//                       // Attach remote MediaStream

//                       if (
//                         audio.srcObject !== stream
//                       ) {
//                         audio.srcObject = stream;
//                       }

//                     }}

//                   />

//                 )
//               )}

//             </div>


//             {/* ===================================
//                 NOT JOINED
//             ==================================== */}

//             {!isJoined && (

//               <div className="mt-6 border-t border-[#30363d] pt-5">

//                <button
//                   onClick={handleJoinVoice}
//                   disabled={isJoiningVoice}
//                   className={`
//                       w-full rounded-lg px-4 py-2.5
//                       text-sm font-medium text-white
//                       transition
//                       ${
//                           isJoiningVoice
//                               ? "bg-blue-800 cursor-not-allowed opacity-60"
//                               : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98]"
//                       }
//                   `}
//                 >
//                   {isJoiningVoice
//                       ? "Joining..."
//                       : "🔊 Join Voice"}
//               </button>

//               </div>

//             )}


//             {/* ===================================
//                 JOINED
//             ==================================== */}
//             {isJoined && (

//               <div className="mt-6 border-t border-[#30363d] pt-5">


//                 {/* CONNECTION STATUS */}

//                 <div className="mb-4 flex items-center justify-center gap-2">

//                   <span
//                     className={`h-2 w-2 rounded-full ${
//                       isConnected
//                         ? "bg-green-500"
//                         : isConnecting
//                         ? "bg-yellow-500"
//                         : "bg-red-500"
//                     }`}
//                   />

//                   <span className="text-xs text-gray-400">

//                     {isConnected
//                       ? "Connected"
//                       : isConnecting
//                       ? "Connecting..."
//                       : "waiting...."}

//                   </span>

//                 </div>


//                 {/* CONTROLS */}

//                 <div className="flex items-center justify-center gap-3">


//                   {/* MUTE */}

//                   <button
//                     onClick={toggleMute}

//                     className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
//                       isMuted
//                         ? "border-yellow-600 bg-yellow-600/10 text-yellow-400 hover:bg-yellow-600/20"
//                         : "border-[#30363d] bg-[#21262d] text-gray-200 hover:bg-[#30363d]"
//                     }`}
//                   >

//                     {isMuted
//                       ? "🔇 Unmute"
//                       : "🎤 Mute"}

//                   </button>


//                   {/* LEAVE */}

                

//                   <button
//                     onClick={onLeaveVoice}

//                     className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 active:scale-[0.98]"
//                   >

//                     ☎ Leave

//                   </button>

//                 </div>

//               </div>

//             )}

//           </>

//         )}

//       </div>

//     </div>
//   );
// }

//     // dek bhai merui baat sun user leave karta hai to do chize karni hoti hai

//     //first claear its all data like all peerconnection , remotestream , local stream , remoteStreamsState, conteionstate ye to sab leave user ke browcer me karna hai 

//     //  second thing sab dusre bowcer me reove then user connewtion so emit a sokvet event ok bhai sun ab use event ko dusre
//     // jb recevei kare to call a function jisme sab data mese us user ka data remvoe hi sajte bhai

//     /// or bhai tune ye sahi handke nhi kiya yaar ek to us voicepanel me tune faltu me vo do useeffect register kr diye yaar 
//     // liye ek baar fir se compent polich karke de 

    



import { useRef } from "react";

export default function VoicePanel({
  onStartVoice,
  handleJoinVoice,
  onLeaveVoice,

  voiceActive,
  voiceUsers,

  sessionId,
  connectionStates,

  remoteStreamsState,

  isMuted,
  toggleMute,
  isStarting,
  setIsStarting,
  isJoiningVoice
}) {
  const remoteAudioRefs = useRef(new Map());

  const isJoined = voiceUsers?.some(
    (voiceUser) => voiceUser.sessionId === sessionId
  );

  const states = Object.values(connectionStates || {});

  const isConnected =
    states.length > 0 &&
    states.every((state) => state === "connected");

  const isConnecting = states.some(
    (state) => state === "new" || state === "connecting"
  );

  const getInitial = (username) => {
    return username?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 shadow-lg backdrop-blur-xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3.5 bg-slate-900/40">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Voice Stage</span>
            {voiceActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </h2>
          <p className="text-[11px] font-medium text-slate-400">
            Real-time Audio Channel
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50 text-base">
          🎙️
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        {/* VOICE NOT STARTED */}
        {!voiceActive && (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/60 shadow-inner">
              <span className="text-xl">🎙️</span>
            </div>

            <p className="mb-3 text-xs text-slate-400 font-medium">
              Start a voice room for active communication
            </p>

            <button
              onClick={onStartVoice}
              disabled={isStarting}
              className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 shadow-md ${
                isStarting
                  ? "bg-emerald-800/50 cursor-not-allowed opacity-60"
                  : "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-emerald-600/20"
              }`}
            >
              {isStarting ? "Starting Stage..." : "🎙️ Start Voice Room"}
            </button>
          </div>
        )}

        {/* VOICE ACTIVE */}
        {voiceActive && (
          <>
            {/* PARTICIPANTS */}
            <div>
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Connected Speakers ({voiceUsers?.length || 0})
              </p>

              <div className="flex flex-wrap gap-3 max-h-[140px] overflow-y-auto p-1 scrollbar-thin">
                {voiceUsers?.map((voiceUser) => (
                  <div
                    key={voiceUser.sessionId}
                    className="flex flex-col items-center gap-1 min-w-[52px]"
                  >
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md border border-blue-400/20">
                      {getInitial(voiceUser.username)}
                    </div>
                    <span className="max-w-[60px] truncate text-[10px] font-medium text-slate-300">
                      {voiceUser.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REMOTE AUDIO ELEMENTS */}
            <div className="hidden">
              {Object.entries(remoteStreamsState || {}).map(
                ([targetSessionId, stream]) => (
                  <audio
                    key={targetSessionId}
                    autoPlay
                    playsInline
                    ref={(audio) => {
                      if (!audio) {
                        remoteAudioRefs.current.delete(targetSessionId);
                        return;
                      }
                      remoteAudioRefs.current.set(targetSessionId, audio);
                      if (audio.srcObject !== stream) {
                        audio.srcObject = stream;
                      }
                    }}
                  />
                )
              )}
            </div>

            {/* NOT JOINED */}
            {!isJoined && (
              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <button
                  onClick={handleJoinVoice}
                  disabled={isJoiningVoice}
                  className={`w-full rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all duration-200 shadow-md ${
                    isJoiningVoice
                      ? "bg-blue-800/50 cursor-not-allowed opacity-60"
                      : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] shadow-blue-600/20"
                  }`}
                >
                  {isJoiningVoice ? "Connecting..." : "🔊 Join Voice Room"}
                </button>
              </div>
            )}

            {/* JOINED CONTROLS */}
            {isJoined && (
              <div className="mt-4 border-t border-slate-800/80 pt-3">
                {/* CONNECTION STATUS */}
                <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-slate-900/60 px-3 py-1.5 border border-slate-800">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected
                        ? "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                        : isConnecting
                        ? "bg-amber-500 animate-ping"
                        : "bg-rose-500"
                    }`}
                  />
                  <span className="text-[11px] font-medium text-slate-300">
                    {isConnected
                      ? "Audio Encrypted & Active"
                      : isConnecting
                      ? "Connecting Peers..."
                      : "Awaiting Peers..."}
                  </span>
                </div>

                {/* CONTROLS BUTTONS */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleMute}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                      isMuted
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                        : "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80"
                    }`}
                  >
                    {isMuted ? "🔇 Unmute Mic" : "🎤 Mute Mic"}
                  </button>

                  <button
                    onClick={onLeaveVoice}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-500/20 active:scale-[0.98]"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}