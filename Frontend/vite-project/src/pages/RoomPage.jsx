import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket/socket";
import UsersPanel from "../components/room/UsersPanel";
import EditorBox from "../components/editor/EditorBox";
import LanguageSelector from "../components/compiler/LanguageSelector";
import RunButton from "../components/compiler/RunButton";
import OutputPanel from "../components/compiler/OutputPanel";
import InputPanel from "../components/compiler/InputPanel";
import ChatPanel from "../components/chat/ChatPanel";
import axiosClient from "../utils/axiosClient";
import LogoutButton from "../components/auth/LogoutButton";
import VoicePanel from "../components/voice/VoicePanel";
import useVoiceChat from "../hooks/useVoiceChat";

function RoomPage() {
  const [typingUser, setTypingUser] = useState("");
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("java");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [runButton, setRunButton] = useState("Run");
  const [copied, setCopied] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState(""); 
  const [myRole, setMyRole] = useState("viewer");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const username = user?.firstName;
  const editorRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const profileRef = useRef(null);

  const isOwner = myRole === "admin";
  const canEdit = myRole === "admin" || myRole === "editor";

  const sessionId = useMemo(() => {
    let id = sessionStorage.getItem("session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("session", id);
    }
    return id;
  }, []);

  // WebRTC
  const {
    voiceUsers,
    voiceActive,
    handleStartVoice,
    handleJoinVoice,
    leaveVoice,
    toggleMute,
    connectionStates,
    remoteStreamsState,
    localStream,
    isMuted,
    isStarting,
    setIsStarting,
    isJoiningVoice
  } = useVoiceChat({
    socket,
    roomId,
    user,
    username,
    sessionId,
  });

  // SOCKET LISTENERS
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected :", socket.id);
    });
    socket.on("receive-code", ({ code, language }) => {
      setCode(code);
      setLanguage(language);
    });
    socket.on("receive-language", ({ language }) => {
      setLanguage(language);
    });
    socket.on("room-users", ({ users, ownerUserId }) => {
      setUsers(users);
      setOwnerUserId(ownerUserId);
      const me = users.find((u) => u.userId === user?._id);
      if (me) setMyRole(me.role);
    });
    socket.on("user-typing", (username) => setTypingUser(username));
    socket.on("user-stop-typing", () => setTypingUser(""));
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socket.on("previous-messages", (oldMessages) => setMessages(oldMessages));
    socket.on("kicked", (msg) => {
      alert(msg);
      navigate("/join");
    });
    socket.on("join-denied", (msg) => {
      alert(msg);
      navigate("/join");
    });
    socket.on("receive-output", ({ output, language }) => {
      setOutput(output);
      setLanguage(language);
    });
    socket.on("system-message", (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg.text }]);
    });

    return () => {
      clearTimeout(typingTimeoutRef.current);
      socket.off("receive-code");
      socket.off("receive-language");
      socket.off("room-users");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("receive-message");
      socket.off("previous-messages");
      socket.off("kicked");
      socket.off("join-denied");
      socket.off("receive-output");
      socket.off("system-message");
    };
  }, []);

  // JOIN ROOM
  useEffect(() => {
    if (!roomId || !username || !user?._id) return;

    socket.emit("join-room", {
      room: roomId,
      username,
      userId: user._id,
      sessionId,
    });
  }, [roomId, username, user?._id, sessionId]);

  // Handle Outside click for profile
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCodeChange(newCode) {
    if (newCode === undefined) return;
    setCode(newCode);

    socket.emit("code-change", { room: roomId, code: newCode, language });
    socket.emit("typing", { room: roomId, username });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { room: roomId, username });
    }, 600);
  }

  function handleLanguageChange(newLang) {
    setLanguage(newLang);
    socket.emit("language-change", {
      room: roomId,
      language: newLang,
      code,
    });
  }

  async function runCode() {
    try {
      setRunButton("Running...");
      const res = await axiosClient.post("/problem/run");
      const result = res.data[0];
      const out = result.stdout || result.compile_output || result.stderr || "No Output";
      socket.emit("share-output", { room: roomId, output: out, language });
      setOutput(out);
    } catch (err) {
      setOutput("Error Running Code. Try Again.");
    } finally {
      setRunButton("Run");
    }
  }

  function sendMessage() {
    if (!message.trim()) return;
    socket.emit("send-message", { room: roomId, username, text: message });
    setMessage("");
  }

  function copyRoomId() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function leaveRoom() {
    socket.emit("leave-room", { room: roomId });
    navigate("/join");
  }

  function kickUser(targetUser) {
    socket.emit("kick-user", {
      room: roomId,
      targetSocketId: targetUser.socketId,
      targetUserId: targetUser.userId,
    });
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e6edf3] p-3 md:p-5 selection:bg-blue-500 selection:text-white">
      {/* HEADER WITH FIXED Z-INDEX DROPDOWN */}
      <header className="relative z-50 mb-5 rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 px-5 py-3.5 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Code<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Together</span>
              </h1>
              <p className="hidden sm:block text-[11px] font-medium text-slate-400">
                Real-time Collaborative Coding
              </p>
            </div>
          </div>

          {/* PROFILE DROPDOWN MENU */}
          <div ref={profileRef} className="relative z-50">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 pr-3 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/60 active:scale-[0.98]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">
                  {user?.firstName}
                </span>
                <span className="text-[10px] text-slate-400">My Account</span>
              </div>

              <svg
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180 text-blue-400" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Container */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-800 bg-[#0d1117] backdrop-blur-2xl shadow-2xl z-50 transition-all">
                <div className="border-b border-slate-800/80 px-4 py-3 bg-slate-900/40">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-100 truncate">
                        {user?.firstName}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* SIDEBAR */}
        <aside className="flex w-full flex-col gap-4 lg:w-80 shrink-0">
          <UsersPanel
            users={users}
            typingUser={typingUser}
            ownerUserId={ownerUserId}
            myRole={myRole}
            currentUserId={user?._id}
            onKick={kickUser}
          />

          <VoicePanel
            onStartVoice={handleStartVoice}
            handleJoinVoice={handleJoinVoice}
            onLeaveVoice={leaveVoice}
            voiceActive={voiceActive}
            voiceUsers={voiceUsers}
            currentUserId={user?._id}
            sessionId={sessionId}
            connectionStates={connectionStates}
            remoteStreamsState={remoteStreamsState}
            localStream={localStream}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isStarting={isStarting}
            setIsStarting={setIsStarting}
            isJoiningVoice={isJoiningVoice}
          />

          <ChatPanel
            messages={messages}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </aside>

        {/* EDITOR & COMPILER MAIN AREA */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 px-5 py-3.5 backdrop-blur-xl shadow-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Room
                </span>
                <h2 className="text-lg font-bold text-white tracking-wide font-mono">
                  #{roomId}
                </h2>
              </div>

              <button
                onClick={copyRoomId}
                className={`ml-2 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : "border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 z-40">
              {canEdit && (
                <LanguageSelector
                  language={language}
                  onChange={handleLanguageChange}
                />
              )}

              {canEdit && (
                <RunButton runButton={runButton} runCode={runCode} />
              )}

              <button
                onClick={leaveRoom}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* EDITOR */}
          <EditorBox
            language={language}
            code={code}
            onChange={handleCodeChange}
            onMount={(editor) => (editorRef.current = editor)}
            canEdit={canEdit}
          />

          {/* INPUT/OUTPUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1117]/80 p-4 shadow-lg backdrop-blur-xl">
              <InputPanel input={input} setInput={setInput} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1117]/80 p-4 shadow-lg backdrop-blur-xl">
              <OutputPanel output={output} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RoomPage; 
















// also bahi ye bhi samja ek baar fir se .unwrap kya hota hai jo dispatch me hai vo in logiyut
// Notes 
// YE BAKI HAI 
//  1.Bhai sun redux me apen jo user name sstore kra erha hai vo refresh me ht jata hai kiyuki page refrese so 
//  later redux me reduxstatepersiste name se kuch hota hai to vo use karna bhai taki refresh me bhi sahi rhe ye state preser username  we wil do it while buidning auth

// 2.  redux code ko smjma ek baar fir se 

/// 3. handle this waht if user click bropwcer back button and join new room deoes it make dubllicate soket  or waht will happen
// at evaer time socekt id new so i dont think so but check again beacuse it make soket id by portnumber and ip or kese

// scroll down and main user message on left and other all right side
// Chat panel flow this steps 
// first buid left panel me jo user panel ke niche add char panel  with input text areafiexed size with y overflow on
// IMPLEMENTATION ORDER
// STEP 1
// Create messages state.
// STEP 2
// Create chat UI.
// STEP 3
// Create sendMessage function.
// STEP 4
// Backend socket event.
// STEP 5
// Frontend listener.
// STEP 6
// Auto-scroll chat.  // baki hai
// (advanced)
// STEP 7
// Message timestamps. // baki hai ye bih 
// (optional)
// 🔥

// components/chat/
//     ChatPanel.jsx
//     ChatMessage.jsx
//     ChatInput.jsx



// then:
// stdin 
// Save rooms
// Chat panel
// Reconnect recovery
// Cursor presence
// Voice room
// Video collaboration
// Whiteboard mode
// Interview mode
// Pair programming mode








// RIGHT NOW BEST ORDER
// 1
// ✅ Copy room id  // done 
// 2
// ✅ Auto room create  // done
// 3
// ✅ URL based rooms //
// 4
// ✅ Toast notifications
// 5
// ✅ Reconnect handling
// 6
// ✅ Cursor presence