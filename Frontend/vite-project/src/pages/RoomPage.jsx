import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";  // only created ones ye hi dusri me bhi lihenet ot connections same to server// for detail go socket.js
import UsersPanel from "../components/room/UsersPanel";
import EditorBox from "../components/editor/EditorBox";
import LanguageSelector from "../components/compiler/LanguageSelector";
import RunButton from "../components/compiler/RunButton";
import OutputPanel from "../components/compiler/OutputPanel";
import InputPanel from "../components/compiler/InputPanel";
import ChatPanel from "../components/chat/ChatPanel";
import { useNavigate } from "react-router-dom";
import axiosClient from  "../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import LogoutButton  from "../components/auth/LogoutButton";
import { useMemo } from "react";
import VoicePanel from "../components/voice/VoicePanel";
import { useRef } from "react";
import useVoiceChat from "../hooks/useVoiceChat";

//editor ko sahi karna baki hai ab tk mtlb foiles or baki add karna bhi
function RoomPage() {
  const [typingUser, setTypingUser] = useState("");
  const [code, setCode] = useState("//code here");
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


  const user = useSelector(
    (state) => state.auth.user
  );
   console.log(user);
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

  // Web RtC
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
        const me = users.find(
            u => u.userId === user._id
        );
        if (me) {
            setMyRole(me.role);
        }
    });
    socket.on("user-typing", (username) => {
      setTypingUser(username);
    });
    socket.on("user-stop-typing", () => {
      setTypingUser("");
    });
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socket.on("previous-messages", (oldMessages) => {
      setMessages(oldMessages);
    });
    socket.on("kicked", (message) => {
      alert(message);
      navigate("/join");
    });
    socket.on( "join-denied",(message) => {
      alert(message);
      navigate("/join");
    });
    socket.on("receive-output",({output , language}) => {
        setOutput(output);
        setLanguage(language);
    });
    socket.on("system-message",(message) => {
       setMessages(prev => [...prev,{system: true,text: message.text}])
    });
  
    return () => { // this will run also when page unmount/navigate(/) run...
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

  // JOIN ROOM SOCKE
  useEffect(() => {

      if (!roomId || !username || !user?._id) return;

      socket.emit("join-room", {
        room: roomId,
        username,
        userId: user._id,
        sessionId
      });

      console.log(sessionId);

  }, [roomId, username, user?._id, sessionId]);

  useEffect(() => {
      function handleClickOutside(e) {
        if (
          profileRef.current &&
          !profileRef.current.contains(e.target)
        ) {
          setShowProfileMenu(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );
  }, []);
      


  // CODE CHANGE
  function handleCodeChange(newCode) {
    if (newCode === undefined) return;
    setCode(newCode);
    // REALTIME CODE SYNC
    socket.emit("code-change", {
      room: roomId,
      code: newCode,
      language
    });

    // TYPING START

    socket.emit("typing", {
      room: roomId,
      username
    });

    // TYPING STOP

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {

      socket.emit("stop-typing", {
        room: roomId,
        username
      });

    }, 600);

  }
  // LANGUAGE CHANGE
  function handleLanguageChange(newLang) {
    setLanguage(newLang);
    socket.emit("language-change", {
      room: roomId,
      language: newLang,
      code
    });

  }
  // RUN CODE
  async function runCode() {
    try {
      setRunButton("Running...");
      const res = await axiosClient.post("/problem/run");
      const result = res.data[0];
      if (result.stdout) {
        socket.emit("share-output", {
          room: roomId,
          output: result.stdout,
          language

        });
        setOutput(result.stdout);
      }
      else if (result.compile_output)  {
        socket.emit("share-output", {
          room: roomId,
          output: result.compile_output,
          language
        });
        setOutput(result.compile_output);
      }
      else if (result.stderr){
        socket.emit("share-output", {
          room: roomId,
          output: result.result.stderr,
          language
        });
        setOutput(result.stderr);
      }
      else   {
        socket.emit("share-output", {
          room: roomId,
          output: "No Output",
          language
        });
        setOutput("No Output");
      }
    }
    catch (err) {
      setOutput("Error Running Code Try Again");
    }
    finally {
      setRunButton("Run");
    }
  }
  // SEND MESSAGE
  function sendMessage() {
    if (!message.trim()) return;
    socket.emit("send-message", {
      room: roomId,
      username,
      text: message,
    });
    setMessage("");
  }
  // COPY ROOM LINK
  function copyRoomId() {
    navigator.clipboard.writeText(
      window.location.href
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }
  function leaveRoom() {
    socket.emit("leave-room", {
      room: roomId
    });
    navigate("/join");
  }
  function kickUser(targetUser) {
    socket.emit("kick-user", {
      room: roomId,
      targetSocketId: targetUser.socketId,
      targetUserId: targetUser.userId
    });
  }


  return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-3 md:p-5">
        {/* ================= NAVBAR ================= */}
         <div className="mb-6 rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4 shadow-lg">

            <div className="flex items-center justify-between">

              {/* LEFT */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-[#58a6ff]">
                  CodeTogether
                </h1>

                <p className="mt-1 text-sm text-[#8b949e]">
                  Real-time Collaborative Coding Platform
                </p>
              </div>

              {/* RIGHT */}
              <div
                ref={profileRef}
                className="relative"
              >

                <button
                  onClick={() =>
                    setShowProfileMenu(!showProfileMenu)
                  }
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#30363d]
                    bg-[#0d1117]
                    px-3
                    py-2
                    transition-all
                    duration-300
                    hover:border-[#58a6ff]
                    hover:bg-[#161b22]
                    hover:shadow-lg
                    active:scale-[0.98]
                  "
                >

                  {/* Avatar */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#2563eb]
                      font-bold
                      text-white
                      shadow-md
                      transition-all
                      duration-300
                      group-hover:scale-105
                    "
                  >
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="hidden sm:flex flex-col text-left">

                    <span className="font-semibold text-white">
                      {user?.firstName}
                    </span>

                    <span className="text-xs text-[#8b949e]">
                      My Account
                    </span>

                  </div>

                  {/* Arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-[#8b949e] transition-all duration-300 ${
                      showProfileMenu ? "rotate-180 text-[#58a6ff]" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                </button>

                {/* Dropdown */}
                <div
                  className={`
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-56
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#30363d]
                    bg-[#161b22]/95
                    backdrop-blur-md
                    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                    z-50
                    origin-top-right
                    transition-all
                    duration-300
                    ease-out

                    ${
                      showProfileMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }
                  `}
                >

                  {/* Profile Info */}
                  <div className="border-b border-[#30363d] px-4 py-4">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-[#2563eb]
                          font-bold
                          text-white
                        "
                      >
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>

                      <div>

                        <p className="font-semibold text-white">
                          {user?.firstName}
                        </p>

                        <p className="text-xs text-[#8b949e]">
                          Signed In
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Logout */}
                  <div className="p-2">
                    <LogoutButton />
                  </div>

                </div>

              </div>

            </div>

        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="flex flex-col gap-5 lg:flex-row">

            {/* ================= LEFT PANEL ================= */}
            <div className="flex w-full flex-col gap-5 lg:w-80 shrink-0">
               {/* // isme grouping baki hai vo doicks wali like shankar (4) wali types  */}
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
                    onLeaveVoice = {leaveVoice}


                    voiceActive={voiceActive}
                    voiceUsers={voiceUsers}


                    currentUserId={user?._id}
                    sessionId = {sessionId}
                    connectionStates = {connectionStates}
                   
                    remoteStreamsState = {remoteStreamsState}
                    localStream = {localStream}
                    isMuted = {isMuted}
                    toggleMute = {toggleMute}
                    isStarting =  {isStarting}
                    setIsStarting = {setIsStarting}
                    isJoiningVoice = {isJoiningVoice}
                />

                <ChatPanel
                  messages={messages}
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                />
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className="flex-1 min-w-0">

              {/* ================= ROOM HEADER ================= */}
              <div className="mb-5 rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4 shadow-lg">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4 flex-wrap">

                    <div>
                      <p className="text-sm text-[#8b949e]">
                        Current Room
                      </p>

                      <h2 className="text-xl md:text-2xl font-bold">
                        {roomId}
                      </h2>
                    </div>

                    <button
                      onClick={copyRoomId}
                      className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                        copied
                          ? "bg-[#238636] text-white"
                          : "border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff]"
                      }`}
                    >
                      {copied ? "Copied ✓" : "Copy Link"}
                    </button>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    {canEdit && (
                      <LanguageSelector
                        language={language}
                        onChange={handleLanguageChange}
                      />
                    )}

                    {canEdit && (
                      <RunButton
                        runButton={runButton}
                        runCode={runCode}
                      />
                    )}

                    <button
                      onClick={leaveRoom}
                      className="rounded-lg bg-[#da3633] px-5 py-2 text-white transition hover:opacity-90"
                    >
                      Leave Room
                    </button>

                  </div>

                </div>

              </div>

              {/* ================= EDITOR ================= */}
              <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-xl">

                <EditorBox
                  language={language}
                  code={code}
                  onChange={handleCodeChange}
                  onMount={(editor) => (editorRef.current = editor)}
                  canEdit={canEdit}
                />

              </div>

              {/* ================= INPUT ================= */}
              <div className="mt-5 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg">

                <InputPanel
                  input={input}
                  setInput={setInput}
                />

              </div>

              {/* ================= OUTPUT ================= */}
              <div className="mt-5 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg">

                <OutputPanel output={output} />

              </div>

            </div>

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