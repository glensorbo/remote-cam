import { Server } from 'socket.io';

import * as http from 'http';

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './interface/IWebsocket';

const cors = {
  origin: '*',
};

export const websocket = {
  connect: (server: http.Server) => {
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server, {
      cors,
    });

    io.on('connection', async (socket) => {
      console.log('Socket connected, id:', socket.id);

      socket.on('join_room', async (roomId) => {
        await socket.join(roomId);
        socket.to(roomId).emit('userJoined', socket.id);
        console.log('Socket connected to room', roomId);
      });

      socket.on('offer', ({ offer, roomId }) => {
        socket.to(roomId).emit('offer', { type: 'offer', offer });
      });

      socket.on('answer', ({ answer, roomId }) => {
        socket.to(roomId).emit('answer', { type: 'answer', answer });
      });

      socket.on('candidate', ({ candidate, roomId }) => {
        socket.to(roomId).emit('candidate', { type: 'candidate', candidate });
      });

      socket.on('leaveRoom', (roomId) => {
        if (roomId) {
          socket.to(roomId).emit('userLeft');
        }
      });
    });
  },
};
