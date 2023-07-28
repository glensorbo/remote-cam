import { websocket } from './websocket';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

interface WebRTC {
  peerConnection: RTCPeerConnection;
  remoteStream: MediaStream;
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream) => void;
  createPeerConnection: () => void;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit>;
  addAnswer: (answer: RTCSessionDescriptionInit) => void;
  addIceCandidate: (candidate: RTCIceCandidateInit) => void;
}

export const webRTC: WebRTC = {
  peerConnection: new RTCPeerConnection(servers),
  remoteStream: new MediaStream(),
  localStream: null,
  setLocalStream: (stream: MediaStream) => {
    webRTC.localStream = stream;
  },
  createPeerConnection: async () => {
    if (webRTC.localStream) {
      webRTC.localStream.getTracks().forEach((track) => {
        if (webRTC.peerConnection && webRTC.localStream) {
          webRTC.peerConnection.addTrack(track, webRTC.localStream);
        }
      });
    }

    webRTC.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        webRTC.remoteStream.addTrack(track);
      });
    };

    webRTC.peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate && websocket.socket) {
        websocket.socket.emit('candidate', {
          candidate,
          roomId: websocket.roomId,
        });
      }
    };
  },
  createOffer: async () => {
    webRTC.createPeerConnection();
    const offer = await webRTC.peerConnection.createOffer();
    await webRTC.peerConnection.setLocalDescription(offer);
    return offer;
  },
  createAnswer: async (offer) => {
    webRTC.createPeerConnection();

    await webRTC.peerConnection.setRemoteDescription(offer);

    const answer = await webRTC.peerConnection.createAnswer();
    await webRTC.peerConnection.setLocalDescription(answer);

    return answer;
  },
  addAnswer: (answer) => {
    if (!webRTC.peerConnection.currentRemoteDescription) {
      webRTC.peerConnection.setRemoteDescription(answer);
    }
  },
  addIceCandidate: (candidate) => {
    console.log('Adding ice');
    webRTC.peerConnection.addIceCandidate(candidate);
  },
};
