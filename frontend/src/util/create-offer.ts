import { servers } from './servers';

export const createOffer = async () => {
  const peerConnection = new RTCPeerConnection(servers);
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};
