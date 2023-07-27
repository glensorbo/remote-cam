import { servers } from './servers';

export const createAnswer = async (offer: RTCSessionDescriptionInit) => {
  const peerConnection = new RTCPeerConnection(servers);

  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  return answer;
};
