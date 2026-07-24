const { Server } = require("socket.io");
const {rooms , roomMessages , disconnectTimers} = require("./socketStore");
const registerUserInRoom = require("./handlers/roomHandler");
const registerEditorHandlers = require("./handlers/editorHandler");
const registerChatHandlers  = require("./handlers/chatHandler");
const registerModerationHandler = require("./handlers/moderationHandler");
const registerDisconnectHandler = require("./handlers/disconnectHandler");
function initializeSocket(server){
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    });
    io.on("connection", (socket) => { 
        registerUserInRoom(io, socket); 
        registerEditorHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerModerationHandler(io, socket);
        registerDisconnectHandler(io, socket); 
    });
}

module.exports = initializeSocket;
