import express from 'express';
import cors from 'cors';
import http from 'http';
import socketServer from './socket';
const app = express();
/**
 * The HTTP server instance.
 */
const server = http.createServer(app);

/* `socketServer(server);` is initializing and setting up a WebSocket server using the `server`
instance created with Node.js's `http` module. This function call is likely setting up the WebSocket
server to handle real-time communication between the client and the server using WebSockets. */
socketServer(server);

app.use(cors());

export default server;
