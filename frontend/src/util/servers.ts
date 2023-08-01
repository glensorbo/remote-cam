export const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

export const backendBaseUrl = import.meta.env.VITE_BACKEND_ENDPOINT as string;
export const frontendBaseUrl = import.meta.env.VITE_FRONTEND_ENDPOINT as string;
