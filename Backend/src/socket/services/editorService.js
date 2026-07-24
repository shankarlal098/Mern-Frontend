
const redis = require("../../confi/redis");

async function codechange(io, socket, payload) {         
    const { room, code, language } = payload;  
    await redis.set(
         `room:${room}`,
            JSON.stringify({
                    code,
                    language
            }),
            {
                    EX: 86400
            }
        );
        socket.to(room).emit("receive-code", {
                code,
                language
        });
}
async function languagechange(io, socket, payload) {
    const { room, language, code } = payload;
    await redis.set(
                `room:${room}`,
                JSON.stringify({
                    code,
                    language
                }),
                {
                    EX: 86400
                }
         );
    socket.to(room).emit("receive-language", {
        language
    });
}
 function typing(io, socket, payload) {
    const { room, username } = payload;
    socket.to(room).emit("user-typing", username);
}
 function stopTyping(io, socket, payload) {
    const { room } = payload;
    socket.to(room).emit("user-stop-typing");
}

module.exports = {
    codechange,
    languagechange,
    typing,
    stopTyping
};