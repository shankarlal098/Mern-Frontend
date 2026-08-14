const {rooms,roomMessages , cleanupVoiceUser}=require("../socketStore");
const redis=require("../../confi/redis");


async function kickUser(io, socket, payload) {

    const { room, targetSocketId, targetUserId } = payload;

    if (!rooms[room]) return;

    if (rooms[room].ownerUserId !== socket.userId)
        return;

    if (targetSocketId === socket.id)
        return;

    // BAN USER FOR 6 HOURS
    await redis.set(
        `room:${room}:banned:${targetUserId}`,
        "true",
        {
            EX: 60 * 60 * 6
        }
    );

    const roomData = rooms[room];

    // FIND ALL SESSIONS OF THIS USER
    const targetUsers = roomData.users.filter(
        user => user.userId === targetUserId
    );

    // REMOVE EVERY SOCKET OF THIS USER
    for (const targetUser of targetUsers) {

        const targetSocket =
            io.sockets.sockets.get(targetUser.socketId);

        if (targetSocket) {

            targetSocket.leave(room);

            targetSocket.room = null;

            targetSocket.emit(
                "kicked",
                "You were removed by host and banned for 6 hours"
            );

        }

        // CANCEL RECONNECT TIMER IF EXISTS
        if (disconnectTimers.has(targetUser.sessionId)) {

            clearTimeout(
                disconnectTimers.get(targetUser.sessionId)
            );

            disconnectTimers.delete(
                targetUser.sessionId
            );
        }

    }

    // REMOVE ALL SESSIONS FROM ROOM
    roomData.users = roomData.users.filter(
        user => user.userId !== targetUserId
    );

    // ROOM EMPTY
    if (roomData.users.length === 0) {

        delete rooms[room];
        delete roomMessages[room];
        return;
    }

  
    io.to(room).emit("system-message", {
        type: "leave",
        text: "A user was removed by the host"
    });

    io.to(room).emit("room-users", {
        users: roomData.users,
        ownerUserId: roomData.ownerUserId
    });
      // clean up voicechat

    cleanupVoiceUser(
        io,
        socket,
        room
    );

}
module.exports = {
    kickUser
};