const {sendMessage  , shareOutput} = require("../services/chatService");


  function registerChatHandlers(io, socket) {
        socket.on("send-message", async ({ room, username, text }) => {
           await sendMessage(io, socket, { room, username, text });  
        });
        socket.on("share-output", async ({ room, output , language}) => {
            await shareOutput(io, socket, { room, output, language });
        });
}

module.exports =  registerChatHandlers ;