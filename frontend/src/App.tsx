import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { HostRoom } from './components/HostRoom';
import { JoinRoom } from './components/JoinRoom';
import { websocket } from './util/websocket';

type Page = 'lobby' | 'host' | 'join';

export const App = () => {
  const [page, setPage] = useState<Page>('lobby');
  const [error, setError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const hostRoomHandler = () => {
    setPage('host');
    websocket.joinRoom(uuidv4());
  };

  const joinRoomHandler = (room?: string) => {
    if (!inputRef.current) return;

    if (room) {
      websocket.joinRoom(room);
      setPage('join');
      return;
    }

    if (!inputRef.current.value) {
      setError(true);
      return;
    }
    websocket.joinRoom(inputRef.current.value);
    setPage('join');
  };

  useEffect(() => {
    websocket.connect();

    const queryParameters = new URLSearchParams(window.location.search);
    const room = queryParameters.get('room');
    if (room) {
      joinRoomHandler(room);
    }
  }, []);

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-indigo-950 text-white'>
      {page === 'lobby' && (
        <div className='w-full p-4 flex flex-col md:w-fit'>
          {error && (
            <span className='text-red-600 mb-2 font-semibold text-md'>
              You need to provide a room id!
            </span>
          )}
          <input
            autoFocus
            type='text'
            ref={inputRef}
            placeholder='Room ID'
            className='w-full rounded outline-none text-black px-4 py-2 md:w-80'
          />
          <div className='w-full flex justify-between mt-5'>
            <button
              className='px-4 py-2 bg-indigo-700 rounded'
              onClick={hostRoomHandler}
            >
              Host Room
            </button>
            <button
              className='px-4 py-2 bg-indigo-700 rounded'
              onClick={() => joinRoomHandler()}
            >
              Join Room
            </button>
          </div>
        </div>
      )}
      {page === 'host' && <HostRoom />}
      {page === 'join' && <JoinRoom />}
    </div>
  );
};
