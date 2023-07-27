import { IAnswer } from './IAnswer';
import { IOffer } from './IOffer';

export interface ClientToServerEvents {
  offer: (data: unknown) => void;
  candidate: (data: unknown) => void;
  answer: (data: unknown) => void;
}

export interface ServerToClientEvents {
  userJoined: (id: string) => void;
  offer: (message: IOffer) => void;
  answer: (message: IAnswer) => void;
}
