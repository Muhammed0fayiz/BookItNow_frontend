import { create } from 'zustand';
import {  Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));

export default useSocketStore;
    