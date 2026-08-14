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
}) {
  // ============================================
  // REMOTE AUDIO ELEMENT REFERENCES
  // ============================================

  const remoteAudioRefs = useRef(new Map());

  // ============================================
  // CURRENT SESSION VOICE ME JOINED?
  // ============================================

  const isJoined = voiceUsers?.some(
    (voiceUser) =>
      voiceUser.sessionId === sessionId
  );



 
  // ============================================
  // WEBRTC CONNECTION STATUS
  // ============================================

  const states = Object.values(
    connectionStates || {}
  );

  const isConnected =
    states.length > 0 &&
    states.every(
      (state) => state === "connected"
    );

  const isConnecting = states.some(
                    (state) =>
                      state === "new" ||
                      state === "connecting"
                  );

  // ============================================
  // AVATAR INITIAL
  // ============================================

  const getInitial = (username) => {
    return (
      username?.charAt(0)?.toUpperCase() || "?"
    );
  };


  
  return (
    <div className="overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-4">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Voice Chat
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Real-time room audio
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#21262d] text-lg">
          🎙️
        </div>

      </div>


      {/* =========================================
          BODY
      ========================================== */}

      <div className="px-5 py-5">

        {/* =======================================
            VOICE NOT STARTED
        ======================================== */}

        {!voiceActive && (

          <div className="flex flex-col items-center py-3">

            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#21262d] text-2xl">
              🎙️
            </div>

            <p className="mb-4 text-sm text-gray-400">
              Start a voice chat for this room
            </p>

            <button
              onClick={onStartVoice}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-500 active:scale-[0.98]"
            >
              🎙️ Start Voice
            </button>

          </div>

        )}


        {/* =======================================
            VOICE ACTIVE
        ======================================== */}

        {voiceActive && (

          <>

            {/* ===================================
                PARTICIPANTS
            ==================================== */}

            <div>

              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Participants
              </p>

              <div className="flex flex-wrap gap-4">

                {voiceUsers?.map((voiceUser) => (

                  <div
                    key={voiceUser.sessionId}
                    className="flex min-w-[64px] flex-col items-center"
                  >

                    {/* Avatar */}

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3b434d] bg-[#21262d] text-sm font-semibold text-white">

                      {getInitial(
                        voiceUser.username
                      )}

                    </div>


                    {/* Username */}

                    <span className="mt-1.5 max-w-[75px] truncate text-xs text-gray-400">

                      {voiceUser.username}

                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* ===================================
                REMOTE AUDIO
            ==================================== */}

            <div className="hidden">

              {Object.entries(
                remoteStreamsState || {}
              ).map(
                ([targetSessionId, stream]) => (

                  <audio
                    key={targetSessionId}
                    autoPlay
                    playsInline

                    ref={(audio) => {

                      if (!audio) {

                        remoteAudioRefs.current.delete(
                          targetSessionId
                        );

                        return;
                      }


                      // Save audio element reference

                      remoteAudioRefs.current.set(
                        targetSessionId,
                        audio
                      );


                      // Attach remote MediaStream

                      if (
                        audio.srcObject !== stream
                      ) {
                        audio.srcObject = stream;
                      }

                    }}

                  />

                )
              )}

            </div>


            {/* ===================================
                NOT JOINED
            ==================================== */}

            {!isJoined && (

              <div className="mt-6 border-t border-[#30363d] pt-5">

                <button
                  onClick={handleJoinVoice}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 active:scale-[0.98]"
                >
                  🔊 Join Voice
                </button>

              </div>

            )}


            {/* ===================================
                JOINED
            ==================================== */}
            {isJoined && (

              <div className="mt-6 border-t border-[#30363d] pt-5">


                {/* CONNECTION STATUS */}

                <div className="mb-4 flex items-center justify-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected
                        ? "bg-green-500"
                        : isConnecting
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />

                  <span className="text-xs text-gray-400">

                    {isConnected
                      ? "Connected"
                      : isConnecting
                      ? "Connecting..."
                      : "waiting...."}

                  </span>

                </div>


                {/* CONTROLS */}

                <div className="flex items-center justify-center gap-3">


                  {/* MUTE */}

                  <button
                    onClick={toggleMute}

                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      isMuted
                        ? "border-yellow-600 bg-yellow-600/10 text-yellow-400 hover:bg-yellow-600/20"
                        : "border-[#30363d] bg-[#21262d] text-gray-200 hover:bg-[#30363d]"
                    }`}
                  >

                    {isMuted
                      ? "🔇 Unmute"
                      : "🎤 Mute"}

                  </button>


                  {/* LEAVE */}

                

                  <button
                    onClick={onLeaveVoice}

                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 active:scale-[0.98]"
                  >

                    ☎ Leave

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

    // dek bhai merui baat sun user leave karta hai to do chize karni hoti hai

    //first claear its all data like all peerconnection , remotestream , local stream , remoteStreamsState, conteionstate ye to sab leave user ke browcer me karna hai 

    //  second thing sab dusre bowcer me reove then user connewtion so emit a sokvet event ok bhai sun ab use event ko dusre
    // jb recevei kare to call a function jisme sab data mese us user ka data remvoe hi sajte bhai

    /// or bhai tune ye sahi handke nhi kiya yaar ek to us voicepanel me tune faltu me vo do useeffect register kr diye yaar 
    // liye ek baar fir se compent polich karke de 

    