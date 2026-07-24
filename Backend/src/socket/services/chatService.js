const { roomMessages } = require("../socketStore");

 function sendMessage(io, socket, payload) {
    const { room, username, text } = payload;

    if (!roomMessages[room]) {
        roomMessages[room] = [];
    }

    const newMessage = {
        username,
        text
    };

    roomMessages[room].push(newMessage);

    io.to(room).emit(
        "receive-message",
        newMessage
    );
}

 function shareOutput(io, socket, payload) {
    const { room, output, language } = payload;

    socket.to(room).emit(
        "receive-output",
        {
            output,
            language
        }
    );
}

module.exports = {
    sendMessage,
    shareOutput
};