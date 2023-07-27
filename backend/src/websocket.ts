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
      const room = socket.handshake.auth.room;

      await socket.join(room);

      console.log('Socket connected', room);

      socket.on('offer', ({ offer }) => {
        socket.to(room).emit('message', { type: 'offer', offer });
      });

      socket.on('candidate', ({ candidate }) => {
        socket.to(room).emit('message', { type: 'candidate', candidate });
      });

      socket.on('answer', ({ answer }) => {
        socket.to(room).emit('message', { type: 'answer', answer });
      });
    });
  },
};
