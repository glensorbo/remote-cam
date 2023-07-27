import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Select, { SingleValue } from 'react-select';

import { useWebsocket } from './hooks/useWebsocket';
import { IOption } from './interface/IOption';

const App = () => {
  const [videoOptions, setVideoOptions] = useState<IOption[]>([]);
  const [audioOptions, setAudioOptions] = useState<IOption[]>([]);

  const streamRef = useRef<HTMLVideoElement | null>(null);

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
      if (streamRef.current) {
        streamRef.current.srcObject = stream;
        await streamRef.current.play();
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
    if (streamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: newValue?.value } },
      });
      streamRef.current.srcObject = stream;
      await streamRef.current.play();

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
    if (streamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: newValue?.value } },
      });
      streamRef.current.srcObject = stream;
      await streamRef.current.play();

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

  const room = uuidv4();
  useEffect(() => {
    if (!socketConnected) {
      connectWebSocket(room);
    }
  }, [room, socketConnected, connectWebSocket]);

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  return (
    <div className='h-screen w-screen relative'>
      <video
        muted
        playsInline
        ref={streamRef}
        className='h-full w-full absolute top-0 left-0'
      ></video>
      <div className='absolute bottom-0 left-0 h-20 p-4 flex gap-4'>
        <Select options={videoOptions} onChange={changeVideo} />
        {/* <Select options={audioOptions} onChange={changeAudio} /> */}
      </div>
    </div>
  );
};

export default App;
