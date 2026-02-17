import { BASE_URL } from "./config.js";
import { io } from "socket.io-client";

export const socket = io(BASE_URL, { autoConnect: true });
