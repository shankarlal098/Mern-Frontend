const {
    joinRoom,
    leaveRoom
} = require("../services/roomService");

 function registerRoomHandlers(io, socket) {

    socket.on("join-room", async ({ room, username, userId , sessionId}) => {
        await joinRoom(io, socket, { room, username, userId , sessionId});
    });

    socket.on("leave-room", async ({ room }) => {
        await leaveRoom(io, socket, { room });
    });

}

module.exports = registerRoomHandlers;