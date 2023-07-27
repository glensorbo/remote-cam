export interface ClientToServerEvents {
  offer: (data: unknown) => void;
  candidate: (data: unknown) => void;
  answer: (data: unknown) => void;
}

export interface ServerToClientEvents {
  message: (message: unknown) => void;
}
