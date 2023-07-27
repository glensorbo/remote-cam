import { useEffect } from 'react';

import { useWebsocket } from '../hooks/useWebsocket';

type Props = {
  roomId: string;
};

export const JoinRoom: React.FC<Props> = ({ roomId }) => {
  const { connectWebSocket, socketConnected } = useWebsocket();

  useEffect(() => {
    if (!socketConnected) {
      connectWebSocket(roomId);
    }
  }, [roomId, socketConnected, connectWebSocket]);

  return <div>{roomId}</div>;
};
