const {
    rooms,
    roomMessages,
    disconnectTimers
} = require("../socketStore");

const redis = require("../../confi/redis");

async function joinRoom(io, socket, payload) {         
            const { room, username, userId } = payload;
            socket.room = room;
            socket.userId = userId;

            const isBanned = await redis.exists(`room:${room}:banned:${userId}`);
            if (isBanned) {
                socket.emit("join-denied", "You are banned from this room");
                return;
            }

            // RECONNECT ?
            if (disconnectTimers.has(userId)) {
                clearTimeout(disconnectTimers.get(userId));
                disconnectTimers.delete(userId);
            }
            let role = "editor";
                if (!rooms[room]) {
                        role = "admin";

                        rooms[room] = {
                            ownerUserId: userId,
                            maxUsers: 5,
                            users: []
                        };
            }

            const roomData = rooms[room];
            const existingUser = roomData.users.find(
                user => user.userId === userId
            );
            socket.join(room);

            if (existingUser) {

                existingUser.socketId = socket.id;
                existingUser.online = true;

                socket.to(room).emit("system-message", {
                    type: "online",
                    text: `${existingUser.username} reconnected`
                });

            } else {
                if (roomData.users.length >= roomData.maxUsers) {
                    role = "viewer";
                }


                roomData.users.push({
                    socketId: socket.id,
                    username,
                    userId,
                    role,
                    online: true
                });

                socket.to(room).emit("system-message", {
                    type: "join",
                    text: `${username} joined the room`
                });
            }

            io.to(room).emit("room-users", {
                users: roomData.users,
                ownerUserId: roomData.ownerUserId
            });

            if (roomMessages[room]) {
                socket.emit("previous-messages", roomMessages[room]);
            }

            const existingRoom = await redis.get(`room:${room}`);
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

            // IF ANY RECONNECT TIMER EXISTS, CANCEL IT
            if (disconnectTimers.has(socket.userId)) {
                clearTimeout(disconnectTimers.get(socket.userId));
                disconnectTimers.delete(socket.userId);
            }

            const leavingUser = roomData.users.find(
                user => user.userId === socket.userId
            );

            if (!leavingUser) return;

            // REMOVE USER
            roomData.users = roomData.users.filter(
                user => user.userId !== socket.userId
            );

            io.to(room).emit("system-message", {
                type: "leave",
                text: `${leavingUser.username} left the room`
            });

            // OWNER TRANSFER
            if (roomData.ownerUserId === socket.userId) {

                if (roomData.users.length > 0) {
                    roomData.ownerUserId = roomData.users[0].userId;
                } else {
                    roomData.ownerUserId = null;
                }
            }

            // ROOM EMPTY
            if (roomData.users.length === 0) {
                delete rooms[room];
                delete roomMessages[room];
                return;
            }

            io.to(room).emit("room-users", {
                users: roomData.users,
                ownerUserId: roomData.ownerUserId
            });

            socket.room = null;
}

module.exports = {
    joinRoom,
    leaveRoom
};