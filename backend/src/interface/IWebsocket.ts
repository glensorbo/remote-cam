export interface ServerToClientEvents {
  userJoined: (id: string) => void;
  message: (message: any) => void;
  offer: (message: any) => void;
  answer: (message: any) => void;
  candidate: (message: any) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  offer: (data: any) => void;
  candidate: (data: any) => void;
  answer: (data: any) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
