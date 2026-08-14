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



// 🔥 Ab backend ka ownership flow complete hai:
// ✅ Same tab refresh → reconnect
// ✅ New tab → new session
// ✅ Owner ki multiple tabs → sab admin
// ✅ Owner ki ek tab band → transfer nahi
// ✅ Owner ki last online tab gayi → next online user owner
// ✅ Next owner ki saari tabs admin ban jayengi
// ✅ Kick logic bhi iske saath compatible rahega