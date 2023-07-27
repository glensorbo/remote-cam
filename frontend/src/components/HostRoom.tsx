import Select, { SingleValue } from 'react-select';
import { useEffect, useRef, useState, useCallback } from 'react';

import { useWebsocket } from '../hooks/useWebsocket';
import { IOption } from '../interface/IOption';

type Props = {
  roomId: string;
};

export const HostRoom: React.FC<Props> = ({ roomId }) => {
  const [videoOptions, setVideoOptions] = useState<IOption[]>([]);
  const [audioOptions, setAudioOptions] = useState<IOption[]>([]);

  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { connectWebSocket, socketConnected } = useWebsocket();

  const getUserDevices = async (type: MediaDeviceKind) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === type);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getUserMedia = useCallback(async () => {
    const constraints = {
      video: true,
      audio: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const videoDevices = await getUserDevices('videoinput');
        const audioDevices = await getUserDevices('audioinput');
        setVideoOptions(
          videoDevices.map((device) => {
            return {
              label: device.label.split('(')[0],
              value: device.deviceId,
            };
          })
        );
        setAudioOptions(
          audioDevices.map((device) => {
            return {
              label: device.label.split('(')[0],
              value: device.deviceId,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const changeVideo = async (newValue: SingleValue<IOption>) => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: newValue?.value } },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const devices = await getUserDevices('videoinput');

      setVideoOptions(
        devices.map((device) => {
          return {
            label: device.label.split('(')[0],
            value: device.deviceId,
          };
        })
      );
    }
  };

  const changeAudio = async (newValue: SingleValue<IOption>) => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: newValue?.value } },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const devices = await getUserDevices('audioinput');

      setAudioOptions(
        devices.map((device) => {
          return {
            label: device.label.split('(')[0],
            value: device.deviceId,
          };
        })
      );
    }
  };

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
  };

  useEffect(() => {
    if (!socketConnected) {
      connectWebSocket(roomId);
    }
  }, [roomId, socketConnected, connectWebSocket]);

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  return (
    <div className='h-screen w-screen relative text-black'>
      <video
        muted
        playsInline
        ref={videoRef}
        onClick={() => setShowControls((state) => !state)}
        className='h-screen w-screen object-cover'
      ></video>
      {showControls && (
        <div className='absolute top-0 left-0 h-20 p-4 flex gap-4 w-full'>
          <Select
            options={videoOptions}
            onChange={changeVideo}
            className='w-1/2 sm:w-52'
          />
          <Select
            options={audioOptions}
            onChange={changeAudio}
            className='w-1/2 sm:w-52'
          />
          <button
            className='px-4 rounded ml-auto bg-indigo-900 text-white'
            onClick={copyRoomId}
          >
            Copy RoomId
          </button>
        </div>
      )}
    </div>
  );
};