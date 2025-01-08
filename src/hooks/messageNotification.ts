'use client';

// ... other imports remain the same ...

const Chat = () => {
  // ... other state and refs remain the same ...

  useEffect(() => {
    if (selectedChatRoom && socketRef.current) {
      socketRef.current.emit('userConnected', selectedChatRoom.myId);

      // Updated message handling logic
      socketRef.current.on('receiveMessage', ({ senderId, message }) => {
        // Only add message if it's from the currently selected chat room
        if (selectedChatRoom.otherId === senderId) {
          setMessages(prevMessages => [...prevMessages, {
            _id: new mongoose.Types.ObjectId().toString(),
            roomId: selectedChatRoom.otherId,
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(selectedChatRoom.myId),
            message: message,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
            role: 'receiver'
          }]);
        } else {
          // Optionally, you could update a notification counter for the other chat room
          console.log(`Received message from ${senderId} while chatting with ${selectedChatRoom.otherId}`);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage');
      }
    };
  }, [selectedChatRoom]);

  // ... rest of the component remains the same ...
};

export default Chat;