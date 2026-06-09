

const express = require('express');
const app = express();
const { Server } = require("socket.io");
const http = require('http');
require('dotenv').config();
const server = http.createServer(app);
const redis = require('./src/confi/redis');
const main = require('./src/confi/db')
const cookieParser = require('cookie-parser');
const codeRouter = require('./src/routes/code');
const authRouter = require('./src/routes/userAuth');
const cors = require("cors");
const CLIENT_URL = process.env.CLIENT_URL;


// Socket.io configuration
const io = new Server(server, {
    cors: {
        origin: "https://mern-frontend-five-sigma.vercel.app",
        credentials: true
    }
});

// Express CORS configuration
app.use(cors({
    origin: "https://mern-frontend-five-sigma.vercel.app",
    credentials: true
}));






app.use(express.json());
app.use(cookieParser());
app.use('/problem', codeRouter);
app.use('/user' , authRouter);

// jwt
const rooms = {};
const roomMessages = {};
function emitSystem(room, text, type = "info") {
    io.to(room).emit("system-message", {
        type,
        text
    });
}
io.on("connection", (socket) => {
    socket.on("join-room", async ({ room, username , userId }) => {
            
        const isBanned = await redis.exists(`room:${room}:banned:${userId}`);
        if (isBanned) {
            socket.emit("join-denied", "You are banned from this room");
            return;
        }
        socket.join(room);
        console.log(room  , username);
        let role = "editor";

        socket.room = room;
        if (!rooms[room]) {
            role = "admin";
            rooms[room] = {
                ownerId: socket.id,
                maxUsers: 5, 
                users: []
            };
        }

        const roomData = rooms[room];
        if (roomData.users.length >= roomData.maxUsers) {
            role = "viewer";
        }
        rooms[room].users.push({
            socketId: socket.id,
            username,
            userId,
            role
        });

        socket.to(room).emit("system-message",{
            type: "join",
            text: `${username} joined the room`
        });

        console.log(room);
        io.to(room).emit( "room-users", {users: rooms[room].users,ownerId: rooms[room].ownerId});
        if (roomMessages[room]) {
            socket.emit(
                "previous-messages",
                roomMessages[room]
            );
        }
        const existingRoom = await redis.get(`room:${room}`);
        if (existingRoom) {
            const roomState = JSON.parse(existingRoom);
            socket.emit("receive-code", roomState);
        }
    });


    socket.on("code-change", async ({ room, code, language }) => {
        await redis.set(
            `room:${room}`,
            JSON.stringify({
                code,
                language
            }),
            {
                EX: 86400
            }
        );
        socket.to(room).emit("receive-code", {
            code,
            language
        });

    });

    socket.on("language-change", async ({ room, language, code }) => {
        await redis.set(
            `room:${room}`,
            JSON.stringify({
                code,
                language
            }),
            {
                EX: 86400
            }
        );
        socket.to(room).emit("receive-language", {
            language
        });
    });


    socket.on("typing", ({ room, username }) => {
        socket.to(room).emit("user-typing", username);
    });



    socket.on("stop-typing", ({ room }) => {
        socket.to(room).emit("user-stop-typing");
    });


    socket.on("send-message", ({ room, username, text }) => {
        // CREATE ROOM MESSAGE ARRAY
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
    });


    socket.on("kick-user", async ({room,targetSocketId,targetUserId}) => {
        if (!rooms[room]) return;

        if (rooms[room].ownerId !== socket.id)
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

        io.to(room).emit(
        "room-users",
        {
            users: rooms[room].users,
            ownerId: rooms[room].ownerId
        }
        );
    }
    );




    socket.on( "share-output", ({ room, output , language}) => {
         socket.to(room).emit("receive-output", {output , language});
    });

     socket.on("leave-room", ({ room }) => {
        socket.leave(room);
        if (!rooms[room]) return;
        const roomData = rooms[room];
        const leavingUser = roomData.users.find(
            u => u.socketId === socket.id
        );
        roomData.users = roomData.users.filter(
            u => u.socketId !== socket.id
        );
        if (leavingUser) {
            io.to(room).emit("system-message", {
                type: "leave",
                text: `${leavingUser.username} left the room`
            });
        }
        if (roomData.ownerId === socket.id) {
            if (roomData.users.length > 0) {
                roomData.ownerId = roomData.users[0].socketId;
            } else {
                roomData.ownerId = null;
            }
        }
        if (roomData.users.length === 0) {
            delete rooms[room];
            delete roomMessages[room];
            return;
        }

        io.to(room).emit("room-users", {
            users: roomData.users,
            ownerId: roomData.ownerId
        });
        socket.room = null;
    });

  
    
    socket.on("disconnect", () => {
        const room = socket.room;
        if (!room || !rooms[room]) return;
        const roomData = rooms[room];
        const leavingUser = roomData.users.find(
            u => u.socketId === socket.id
        );
        roomData.users = roomData.users.filter(
            u => u.socketId !== socket.id
        );
        if (leavingUser) {
            io.to(room).emit("system-message", {
                type: "leave",
                text: `${leavingUser.username} left the room`
            });
        }
        if (roomData.ownerId === socket.id) {
            if (roomData.users.length > 0) {
                roomData.ownerId = roomData.users[0].socketId;
            } else {
                roomData.ownerId = null;
            }
        }
        if (roomData.users.length === 0) {
            delete rooms[room];
            delete roomMessages[room];
            return;
        }
        io.to(room).emit("room-users", {
            users: roomData.users,
            ownerId: roomData.ownerId
        });
    });
});

const connectDBs = async () => {

    await redis.connect();
    console.log("Connected to Redis");

    await main();
    console.log("Connected to Mongo");

};
const PORT = 10000;

connectDBs()
  .then(() => {
        server.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
      console.error(err);
  });






