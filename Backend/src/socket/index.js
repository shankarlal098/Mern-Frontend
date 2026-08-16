const { Server } = require("socket.io");
const {rooms , roomMessages , disconnectTimers} = require("./socketStore");
const registerUserInRoom = require("./handlers/roomHandler");
const registerEditorHandlers = require("./handlers/editorHandler");
const registerChatHandlers  = require("./handlers/chatHandler");
const registerModerationHandler = require("./handlers/moderationHandler");
const registerDisconnectHandler = require("./handlers/disconnectHandler");
const registerVoiceHandlers = require("./handlers/voiceHandler");

function initializeSocket(server){
    const io = new Server(server,{
        cors:{
            origin:"https://codetogether-mu.vercel.app",
            credentials:true
        }
    });
    io.on("connection", (socket) => { 
        registerUserInRoom(io, socket); 
        registerEditorHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerModerationHandler(io, socket);
        registerDisconnectHandler(io, socket); 
        registerVoiceHandlers(io, socket);
    });
}

module.exports = initializeSocket;
