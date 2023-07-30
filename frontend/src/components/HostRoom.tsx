import Select, { SingleValue } from 'react-select';
import { useEffect, useRef, useState, useCallback } from 'react';

import { IOption } from '../interface/IOption';
import { websocket } from '../util/websocket';
import { webRTC } from '../util/webRTC';

export const HostRoom: React.FC = () => {
  const [videoOptions, setVideoOptions] = useState<IOption[]>([]);
  const [audioOptions, setAudioOptions] = useState<IOption[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    const constraints: MediaStreamConstraints = {
      video: {
        width: { min: 1920 },
        height: { min: 1080 },
      },
      audio: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        webRTC.setLocalStream(stream);
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
        video: {
          deviceId: { exact: newValue?.value },
          width: { min: 1920 },
          height: { min: 1080 },
        },
      });
      videoRef.current.srcObject = stream;
      webRTC.changeSource(stream);

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

      webRTC.changeSource(stream);

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
    await navigator.clipboard.writeText(websocket.roomId);
  };

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  return (
    <div className='h-screen w-screen flex flex-col items-center p-4 gap-4 text-black'>
      <div className='flex flex-col gap-4 w-full sm:w-[480px]'>
        <Select
          options={videoOptions}
          onChange={changeVideo}
          className='w-full'
        />
        <Select
          options={audioOptions}
          onChange={changeAudio}
          className='w-full'
        />
        <button
          className='w-full py-2 rounded ml-auto bg-indigo-900 text-white'
          onClick={copyRoomId}
        >
          Copy RoomId
        </button>
      </div>

      <video
        muted
        controls
        autoPlay
        playsInline
        ref={videoRef}
        // className='w-screen sm:w-[480px] object-center'
        // className='object-center'
      ></video>
    </div>
  );
};
