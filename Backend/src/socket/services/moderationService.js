const {rooms,roomMessages}=require("../socketStore");
const redis=require("../../confi/redis");


async function kickUser(io, socket, payload) {
    const { room, targetSocketId, targetUserId } = payload;      
           if (!rooms[room]) return;
            if (rooms[room].ownerUserId !== socket.userId)
                return;
            if (targetSocketId === socket.id) return;
            const targetSocket =io.sockets.sockets.get(targetSocketId);
            if (!targetSocket) return;

            await redis.set(`room:${room}:banned:${targetUserId}`,"true",
            {
                EX: 60 * 60 * 6
            }
            );
            targetSocket.leave(room);

            targetSocket.room = null;
            rooms[room].users =
            rooms[room].users.filter(
                (user) =>
                user.socketId !== targetSocketId
            );

            targetSocket.emit(
            "kicked",
            "You were removed by host and banned for 6 hours"
            );

            if (rooms[room].users.length === 0) {
            delete rooms[room];
            delete roomMessages[room];
            return;
            }

        io.to(room).emit("room-users", {
                users: rooms[room].users,
                ownerUserId: rooms[room].ownerUserId
         });
}
module.exports = {
    kickUser
};