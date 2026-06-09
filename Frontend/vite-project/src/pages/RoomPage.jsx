import { useEffect, useState, useRef } from "react";
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

//   editor ko sahi karna baki hai ab tk mtlb foiles or baki add karna bhi
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
  const [ownerId, setOwnerId] = useState("");
  const [myRole, setMyRole] = useState("viewer");
    const user = useSelector(
    (state) => state.auth.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const username = user?.firstName;
  const editorRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOwner = myRole === "admin";
  const canEdit = myRole === "admin" || myRole === "editor";

  

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
    socket.on("room-users", ({ users, ownerId }) => {
      setUsers(users);
      setOwnerId(ownerId);
       const me = users.find(
         u => u.socketId === socket.id
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
    if (!roomId || !username) return;
      socket.emit("join-room", {
        room: roomId,
        username,
        userId: user._id
      });
  }, [roomId, username]);


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
  <div className="min-h-screen bg-base-300 text-white p-3 md:p-5">
    {/* NAV BAR */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">
        CodeTogether
      </h1>
      <div className="flex items-center gap-3">
        <span className="font-medium text-sm md:text-base">
          {user?.firstName}
        </span>
        <LogoutButton />
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-5">
      {/* LEFT PANEL */}
      <div className="flex flex-col gap-5 w-full lg:w-80 shrink-0">
        <UsersPanel
          users={users}
          typingUser={typingUser}
          ownerId={ownerId}
          onKick={kickUser}
        />
        <ChatPanel
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      
      {/* RIGHT PANEL */}
      <div className="flex-1 min-w-0">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <h2 className="text-lg md:text-2xl font-semibold truncate">
              Room: <span className="text-cyan-400 ml-2">{roomId}</span>
            </h2>
            <button
              onClick={copyRoomId}
              className={`btn btn-sm ${
                copied ? "btn-success" : "btn-outline btn-info"
              }`}
            >
              {copied ? "Copied!" : "CopyLink"}
            </button>
          </div>
          
          <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
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
              className="btn btn-error btn-sm"
            >
              Leave
            </button>
          </div>
        </div>

        {/* EDITOR */}
        <div className="border border-cyan-500 rounded-xl overflow-hidden w-full">
          <EditorBox
            language={language}
            code={code}
            onChange={handleCodeChange}
            onMount={(editor) => (editorRef.current = editor)}
            canEdit
          />
        </div>

        {/* INPUT */}
        <div className="mt-5">
          <InputPanel
            input={input}
            setInput={setInput}
          />
        </div>

        {/* OUTPUT */}
        <div className="mt-5">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  </div> 
   );
}






// also bahi ye bhi samja ek baar fir se .unwrap kya hota hai jo dispatch me hai vo in logiyut






export default RoomPage;








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