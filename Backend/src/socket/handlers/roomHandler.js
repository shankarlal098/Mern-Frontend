const {
    joinRoom,
    leaveRoom
} = require("../services/roomService");

 function registerRoomHandlers(io, socket) {

    socket.on("join-room", async ({ room, username, userId }) => {
        await joinRoom(io, socket, { room, username, userId });
    });

    socket.on("leave-room", async ({ room }) => {
        await leaveRoom(io, socket, { room });
    });

}

module.exports = registerRoomHandlers;