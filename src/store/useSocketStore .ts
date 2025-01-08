import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '@/shared/axiousintance';
import { UserStore, UserProfile } from '@/types/store';

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
    