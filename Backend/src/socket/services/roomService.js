const {
    rooms,
    roomMessages,
    disconnectTimers,
    cleanupVoiceUser
} = require("../socketStore");

const redis = require("../../confi/redis");
async function joinRoom(io, socket, payload) {
     console.log("payloaf"  ,  payload);
    const { room, username, userId, sessionId } = payload;

    socket.room = room;
    socket.userId = userId;
    socket.sessionId = sessionId;
    // ===========================
    // USER BANNED ?
    // ===========================
    const isBanned = await redis.exists(
        `room:${room}:banned:${userId}`
    );

    if (isBanned) {

        socket.emit(
            "join-denied",
            "You are banned from this room"
        );

        return;
    }

    // ===========================
    // CREATE ROOM
    // ===========================
    if (!rooms[room]) {

        rooms[room] = {

            ownerUserId: userId,
            maxUsers: 5,
            users: []

        };

    }

    const roomData = rooms[room];

    socket.join(room);

    // ======================================
    // RECONNECT
    // ======================================
    if (disconnectTimers.has(sessionId)) {

        clearTimeout(
            disconnectTimers.get(sessionId)
        );

        disconnectTimers.delete(sessionId);

        const reconnectUser =
            roomData.users.find(
                user =>
                    user.sessionId === sessionId
            );

        if (reconnectUser) {

            // Was every tab offline?
            const wasOffline =
                !roomData.users.some(
                    user =>
                        user.userId === userId &&
                        user.online
                );

            reconnectUser.socketId = socket.id;
            reconnectUser.online = true;

            if (wasOffline) {

                socket.to(room).emit(
                    "system-message",
                    {
                        type: "online",
                        text: `${reconnectUser.username} reconnected`
                    }
                );

            }

        }

    }

    // ======================================
    // NEW TAB / NEW SESSION
    // ======================================
    else {

        let role = "editor";

        if (roomData.ownerUserId === userId) {

            role = "admin";

        }
        else if (
            roomData.users.length >=
            roomData.maxUsers
        ) {

            role = "viewer";

        }

        // Already present in another tab?
        const alreadyPresent =
            roomData.users.some(
                user =>
                    user.userId === userId
            );

        roomData.users.push({

            socketId: socket.id,
            username,
            userId,
            sessionId,
            role,
            online: true

        });

        // Only first tab should announce join
        if (!alreadyPresent) {

            socket.to(room).emit(
                "system-message",
                {
                    type: "join",
                    text: `${username} joined the room`
                }
            );

        }

    }

    // ===========================
    // USERS UPDATE
    // ===========================
    io.to(room).emit(
        "room-users",
        {
            users: roomData.users,
            ownerUserId:
                roomData.ownerUserId
        }
    );

    // ===========================
    // OLD CHAT
    // ===========================
    if (roomMessages[room]) {

        socket.emit(
            "previous-messages",
            roomMessages[room]
        );

    }

    // ===========================
    // RESTORE CODE
    // ===========================
    const existingRoom =
        await redis.get(`room:${room}`);

    if (existingRoom) {

        socket.emit(
            "receive-code",
            JSON.parse(existingRoom)
        );

    }

}

function leaveRoom(io, socket, payload) {

    const { room } = payload;

    socket.leave(room);

    if (!rooms[room]) return;

    const roomData = rooms[room];

    // CANCEL RECONNECT TIMER
    if (disconnectTimers.has(socket.sessionId)) {

        clearTimeout(
            disconnectTimers.get(socket.sessionId)
        );

        disconnectTimers.delete(socket.sessionId);

    }

    
    const leavingUser = roomData.users.find(
        user => user.sessionId === socket.sessionId
    );

    if (!leavingUser) return;

    // REMOVE ONLY CURRENT SESSION
    roomData.users = roomData.users.filter(
        user => user.sessionId !== socket.sessionId
    );

    // ==================================
    // SEND LEAVE ONLY IF LAST TAB CLOSED
    // ==================================
    const remainingSessions =
        roomData.users.some(
            user => user.userId === socket.userId
        );

    if (!remainingSessions) {

        io.to(room).emit(
            "system-message",
            {
                type: "leave",
                text: `${leavingUser.username} left the room`
            }
        );

    }

    // ==================================
    // OWNER TRANSFER
    // ==================================
    if (roomData.ownerUserId === socket.userId) {

        const ownerStillOnline =
            roomData.users.some(
                user =>
                    user.userId === socket.userId &&
                    user.online
            );

        if (!ownerStillOnline) {

            const nextOwner =
                roomData.users.find(
                    user => user.online
                );

            if (nextOwner) {

                roomData.ownerUserId =
                    nextOwner.userId;

                // NEXT OWNER KI SAARI TABS ADMIN
                roomData.users.forEach(user => {

                    if (
                        user.userId === nextOwner.userId
                    ) {

                        user.role = "admin";

                    }

                });

            }
            else {

                roomData.ownerUserId = null;

            }

        }

    }

    // ROOM EMPTY
    if (roomData.users.length === 0) {

        delete rooms[room];
        delete roomMessages[room];
        return;

    }

    io.to(room).emit(
        "room-users",
        {
            users: roomData.users,
            ownerUserId: roomData.ownerUserId
        }
    );

   // clean up voicechat

    cleanupVoiceUser(
        io,
        socket,
        room
    );

    socket.room = null;

}
module.exports = {
    joinRoom,
    leaveRoom
};