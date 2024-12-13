// import { io, Socket } from 'socket.io-client';

// // Ensure you have the correct backend URL
// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// export const socket: Socket = io(SOCKET_URL, {
//   autoConnect: false, // Manual connection
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000
// });

// // Optional: Add connection and disconnection handlers
// export const connectSocket = (userId: string) => {
//   if (socket.disconnected) {
//     socket.auth = { userId };
//     socket.connect();
//   }
// };

// export const disconnectSocket = () => {
//   if (socket.connected) {
//     socket.disconnect();
//   }
// };

// // Optional: Error handling
// socket.on('connect_error', (error) => {
//   console.error('Socket connection error:', error);
// });