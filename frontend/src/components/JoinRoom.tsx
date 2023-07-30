import { useRef, useEffect } from 'react';

import { webRTC } from '../util/webRTC';

export const JoinRoom = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = webRTC.remoteStream;
    }
  }, []);

  return (
    <video
      controls
      autoPlay
      playsInline
      ref={videoRef}
      className='h-screen w-screen object-cover'
    ></video>
  );
};
