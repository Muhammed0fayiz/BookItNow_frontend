// import { useEffect } from "react";
// import { useSocketContext } from "../context/SocketContext";
// import { Message } from "../types/Message";

// type SetChatMessages = React.Dispatch<React.SetStateAction<Message[]>>;

// const useListenMessage = (setChatMessages: SetChatMessages): void => {
//   const { socket } = useSocketContext();

//   useEffect(() => {
//     if (socket) {
//       const handleNewMessage = (newMessage: Message) => {
//         setChatMessages((prevMessages) => [...prevMessages, newMessage]);
//       };

//       socket.on("newMessage", handleNewMessage);

//       return () => {
//         socket.off("newMessage", handleNewMessage);
//       };
//     }
//   }, [socket, setChatMessages]);
// };

// export default useListenMessage;
