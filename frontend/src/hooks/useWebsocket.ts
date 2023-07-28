import { useState } from 'react';
import { Socket, io } from 'socket.io-client';

export const backendBaseUrl = import.meta.env.VITE_BACKEND_ENDPOINT as string;

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../interface/IWebsocket';

export const useWebsocket = () => {
  const [roomId, setRoomId] = useState('');

  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const connectWebSocket = () => {
    if (!socket) {
      const con = io(backendBaseUrl);
      setSocket(con);
      con?.on('connect', () => console.log('Socket connected', con?.id));
    }
  };

  const joinRoom = (roomId: string) => {
    socket?.emit('join_room', roomId);
    setRoomId(roomId);
  };

  // const connectWebSocket = (roomId: string) => {
  //   setRoom(roomId);
  //   // const connection = io(backendBaseUrl, { auth: { room } });
  //   // setSocket(connection);

  //   // connection.on('connect', () => {
  //   //   setSocketConnected(true);
  //   //   console.log('Socket connected', room);
  //   // });

  //   // socket.on('userJoined', async (id) => {
  //   //   console.log('User Joined', id);
  //   //   const offer = await createOffer();
  //   //   if (socket) {
  //   //     socket.emit('offer', { offer });
  //   //   }
  //   // });

  //   // socket.on('offer', (message) => {
  //   //   createAnswer(message.offer);
  //   // });

  //   // socket.on('message', () => {
  //   //   if (message.type === 'offer') {
  //   //     createAnswer(message.offer);
  //   //   }

  //   //   if (message.type === 'answer') {
  //   //     addAnswer(message.answer);
  //   //   }

  //   //   if (message.type === 'candidate') {
  //   //     if (peerConnection) {
  //   //       peerConnection.addIceCandidate(message.candidate);
  //   //     }
  //   //   }
  //   // } );
  // };

  return { connectWebSocket, socket, joinRoom, roomId };
};
