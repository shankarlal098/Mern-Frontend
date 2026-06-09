import { io } from "socket.io-client";
export const socket = io("https://full-stack-event-wus1.onrender.com");


// when io() call first it will check is "http://localhost:3000" this location is already connceted ifn yes then returnobject of its soket 
// esle connet it 3 hand sahke w
