export interface ServerToClientEvents {
  userJoin: (id: string) => void;
  message: (message: any) => void;
}

export interface ClientToServerEvents {
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
