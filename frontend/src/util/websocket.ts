import { Socket, io } from 'socket.io-client';

import { webRTC } from './webRTC';

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../interface/IWebsocket';

const backendBaseUrl = import.meta.env.VITE_BACKEND_ENDPOINT as string;

interface Websocket {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  roomId: string;
  connect: () => void;
  joinRoom: (roomId: string) => void;
}

export const websocket: Websocket = {
  socket: null,
  roomId: '',
  connect: () => {
    const socket = io(backendBaseUrl);
    websocket.socket = socket;
    socket.on('connect', () => console.log('Socket connected', socket.id));
  },
  joinRoom: (roomId) => {
    websocket.socket?.emit('join_room', roomId);
    websocket.roomId = roomId;

    websocket.socket?.on('userJoined', async (id) => {
      console.log('User joined', id);
      const offer = await webRTC.createOffer();
      websocket.socket?.emit('offer', { offer, roomId: websocket.roomId });
    });

    websocket.socket?.on('offer', async (message) => {
      console.log('Received offer');
      const answer = await webRTC.createAnswer(message.offer);
      websocket.socket?.emit('answer', { answer, roomId: websocket.roomId });
    });

    websocket.socket?.on('answer', (message) => {
      console.log('Received answer');
      webRTC.addAnswer(message.answer);
    });

    websocket.socket?.on('candidate', (message) => {
      console.log('Received candidate');
      webRTC.addIceCandidate(message.candidate);
    });
  },
};
