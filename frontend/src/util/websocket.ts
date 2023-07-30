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
  },
  joinRoom: (roomId) => {
    websocket.socket?.emit('join_room', roomId);
    websocket.roomId = roomId;

    websocket.socket?.on('userJoined', async () => {
      const offer = await webRTC.createOffer();
      websocket.socket?.emit('offer', { offer, roomId: websocket.roomId });
    });

    websocket.socket?.on('offer', async (message) => {
      const answer = await webRTC.createAnswer(message.offer);
      websocket.socket?.emit('answer', { answer, roomId: websocket.roomId });
    });

    websocket.socket?.on('answer', (message) => {
      webRTC.addAnswer(message.answer);
    });

    websocket.socket?.on('candidate', (message) => {
      webRTC.addIceCandidate(message.candidate);
    });
  },
};
