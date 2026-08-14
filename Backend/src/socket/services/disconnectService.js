const {
    rooms,
    roomMessages,
    disconnectTimers,
    cleanupVoiceUser

} = require("../socketStore");

async function disconnect(io, socket) {

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    const disconnectUser = roomData.users.find(
        user => user.sessionId === socket.sessionId
    );

    if (!disconnectUser) return;

    // ==========================
    // MARK OFFLINE
    // ==========================
    disconnectUser.online = false;

    // Is user ki koi aur online tab hai?
    const stillOnline = roomData.users.some(
        user =>
            user.userId === socket.userId &&
            user.online
    );

    // Sirf last online tab thi to offline message bhejo
    if (!stillOnline) {

        io.to(room).emit(
            "system-message",
            {
                type: "offline",
                text: `${disconnectUser.username} is Offline.`
            }
        );

    }

    io.to(room).emit(
        "room-users",
        {
            users: roomData.users,
            ownerUserId: roomData.ownerUserId
        }
    );

    // ==========================
    // START RECONNECT TIMER
    // ==========================
    disconnectTimers.set(

        socket.sessionId,

        setTimeout(() => {

            // REMOVE THIS SESSION
            roomData.users =
                roomData.users.filter(
                    user =>
                        user.sessionId !== socket.sessionId
                );

            disconnectTimers.delete(
                socket.sessionId
            );

            // Kya is user ki koi session bachi?
            const remainingSessions =
                roomData.users.some(
                    user =>
                        user.userId === socket.userId
                );

            // Sirf last session remove hui to leave message
            if (!remainingSessions) {

                io.to(room).emit(
                    "system-message",
                    {
                        type: "leave",
                        text: `${disconnectUser.username} left the room`
                    }
                );

            }

            // ==========================
            // OWNER TRANSFER
            // ==========================
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

                        // Next owner ki saari tabs admin
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

            // ==========================
            // ROOM EMPTY
            // ==========================
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

        }, 60000)

    );

    cleanupVoiceUser(
        io,
        socket,
        room
    );




    }

module.exports = {
    disconnect
};