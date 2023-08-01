import { IAnswer } from './IAnswer';
import { ICandidate } from './ICandidate';
import { IOffer } from './IOffer';

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  offer: (data: unknown) => void;
  candidate: (data: unknown) => void;
  answer: (data: unknown) => void;
  leaveRoom: (roomId: string) => void;
}

export interface ServerToClientEvents {
  userJoined: (id: string) => void;
  userLeft: () => void;
  offer: (message: IOffer) => void;
  answer: (message: IAnswer) => void;
  candidate: (message: ICandidate) => void;
}
