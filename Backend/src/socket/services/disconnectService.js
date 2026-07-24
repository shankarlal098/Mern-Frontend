const {
    rooms,
    roomMessages,
    disconnectTimers
} = require("../socketStore");

const redis = require("../../confi/redis");

async function disconnect(io, socket, payload) {         
            const room = socket.room;
            if (!room || !rooms[room]) return;
            const roomData = rooms[room];
            const disconnectUser = roomData.users.find(
                user => user.userId === socket.userId
            );
            if (!disconnectUser) return;

            // MARK OFFLINE
            disconnectUser.online = false;

            io.to(room).emit("system-message", {
                type: "offline",
                text: `${disconnectUser.username} is Offline.`
            });
            

            // START RECONNECT TIMER
            disconnectTimers.set(
                socket.userId,
                setTimeout(() => {

                    roomData.users = roomData.users.filter(
                        user => user.userId !== socket.userId
                    );

                    disconnectTimers.delete(socket.userId);

                    io.to(room).emit("system-message", {
                        type: "leave",
                        text: `${disconnectUser.username} left the room`
                    });

                    // OWNER TRANSFER
                    if (roomData.ownerUserId === socket.userId) {

                        if (roomData.users.length > 0) {
                            roomData.ownerUserId =
                                roomData.users[0].userId;
                        } else {
                            roomData.ownerUserId = null;
                        }
                    }

                    if (roomData.users.length === 0) {
                        delete rooms[room];
                        delete roomMessages[room];
                        return;
                    }

                    io.to(room).emit("room-users", {
                        users: roomData.users,
                        ownerUserId: roomData.ownerUserId
                    });

                }, 60000)
            );
}

module.exports = {
   disconnect
};