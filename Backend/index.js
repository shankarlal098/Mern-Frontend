
require('dotenv').config();
const http = require('http');
// Expresss server app for handling REST API requests
const express = require('express');
const app = express();

/// ataached the express code to htttp server 
const server = http.createServer(app);


const { Server } = require("socket.io");

const redis = require('./src/confi/redis');
const main = require('./src/confi/db')

const codeRouter = require('./src/routes/code');
const authRouter = require('./src/routes/userAuth');

const cookieParser = require('cookie-parser');
const cors = require("cors");
const CLIENT_URL = process.env.CLIENT_URL;


const initializeSocket=require("./src/socket/index");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/problem', codeRouter);
app.use('/user' , authRouter);


const connectDBs = async () => {

    await redis.connect();
    console.log("Connected to Redis");

    await main();
    console.log("Connected to Mongo");

};
const PORT = 3000;

connectDBs()
  .then(() => {
        initializeSocket(server);
        server.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
      console.error(err);
  });






