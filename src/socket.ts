import { Server } from 'socket.io';
import http from 'http';
import { EVENTS } from './constant';
import { getAllConnectedClients } from './utils';
const userSocketMap: { [socketId: string]: string } = {};

/**
 * Starts the socket server and handles socket events.
 *
 * @param server - The HTTP server instance.
 * @returns A Promise that resolves when the socket server is started.
 */
export default async function socketServer(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
  /**
   * The socket.io server instance.
   */
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  /*  Socket.IO server implementation */
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    /* This code is handling the event when a client joins a specific room. When a client emits
    the `EVENTS.JOIN` event with the payload containing `roomId` and `username`, the server performs
    the following actions: */
    socket.on(EVENTS.JOIN, ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);
      console.log('socket joined', roomId, username, socket.rooms);
      const clients = getAllConnectedClients(roomId, io, userSocketMap);
      /*  This allows the server to notify all other connected clients
      in the same room about a new client joining, providing them with the necessary information. */
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(EVENTS.JOINED, {
          clients,
          username,
          socketId: socket.id
        });
      });
    });

    /* This code is handling the event when a client sends a code change in a specific room.
    When a client emits the `EVENTS.CODE_CHANGE` event with the `roomId` and `code` payload, the
    server receives this event and then broadcasts this code change to all other sockets in the same
    room except the sender. */
    socket.on(EVENTS.CODE_CHANGE, ({ roomId, code }) => {
      socket.in(roomId).emit(EVENTS.CODE_CHANGE, { code });
    });

    /* The code is handling the event when a client sends a synchronization request for code changes. */
    socket.on(EVENTS.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(EVENTS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
      Object.keys(socket.rooms).forEach((roomId) => {
        // Get list of clients in the room
        const clients = getAllConnectedClients(roomId, io, userSocketMap);

        // Remove the disconnected user from the userSocketMap
        delete userSocketMap[socket.id];

        // Emit event to notify remaining users in the room about disconnection
        clients.forEach(({ socketId }) => {
          io.to(socketId).emit(EVENTS.DISCONNECTED, {
            disconnectedUserId: socket.id
          });
        });
      });
    });
  });
}
