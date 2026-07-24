const { codechange, languagechange, typing, stopTyping } = require("../services/editorService");

 function registerEditorHandlers(io, socket){
    socket.on("code-change", async ({ room, code, language }) => {
       await codechange(io, socket, { room, code, language });      
    });
    socket.on("language-change", async ({ room, language, code }) => {
       await languagechange(io, socket, { room, language, code });      
    });
    socket.on("typing", async ({ room, username }) => {
       await typing(io, socket, { room, username });
    });
    socket.on("stop-typing", async ({ room }) => {
       await stopTyping(io, socket, { room });
    });
}


module.exports = registerEditorHandlers ;