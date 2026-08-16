import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://full-stack-event-wus1.onrender.com";

export const socket = io(BACKEND_URL , {
  autoConnect: true,
  transports: ["websocket", "polling"]
});