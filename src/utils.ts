import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

/**
 * Retrieves all connected clients in a specific room.
 *
 * @param roomId - The ID of the room.
 * @param io - The socket.io server instance.
 * @param userSocketMap - A mapping of socket IDs to usernames.
 * @returns An array of objects containing the socket ID and username of each connected client.
 */
export function getAllConnectedClients(
  roomId: string,
  io: Server<DefaultEventsMap, DefaultEventsMap>,
  userSocketMap: { [socketId: string]: string }
) {
  /* This code snippet is retrieving all connected clients in a specific room by first getting the list
  of socket IDs in that room from the socket.io server instance (`io`) using
  `io.sockets.adapter.rooms.get(roomId)`. */
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId]
      };
    }
  );
}
