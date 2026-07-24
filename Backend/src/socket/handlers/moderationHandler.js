

const {kickUser} = require("../services/moderationService");

 function registerModerationHandler(io, socket) {
    socket.on("kick-user", async ({room,targetSocketId,targetUserId}) => {
        await kickUser(io, socket, {room,targetSocketId,targetUserId});
    });
}

module.exports = registerModerationHandler;