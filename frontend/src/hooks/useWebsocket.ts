import { useState } from 'react';
import { Socket, io } from 'socket.io-client';

export const backendBaseUrl = import.meta.env.VITE_BACKEND_ENDPOINT as string;

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../interface/IWebsocket';

export const useWebsocket = () => {
  const [socketConnected, setSocketConnected] = useState(false);

  let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  const connectWebSocket = (room: string) => {
    socket = io(backendBaseUrl, { auth: { room: room } });

    socket.on('connect', () => {
      setSocketConnected(true);
      console.log('Socket connected', room);
    });

    /* socket.on('userJoin', (chatter: IChatter) => {});

    socket.on('userLeft', (id: string) => {} );*/
  };

  return { connectWebSocket, socket, socketConnected };
};
