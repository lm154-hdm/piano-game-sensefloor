// src/lib/socket.js
import io from "socket.io-client";

const IP = '192.168.178.22';
const PORT = 8000;

const socket = io(`http://${IP}:${PORT}`); // your server URL here

export default socket;
