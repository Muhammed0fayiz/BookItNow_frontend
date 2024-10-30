import { create } from 'zustand';
import { ChatMessage, ChatState } from '@/types/store';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  newMessage: '',
  setNewMessage: (message: string) => set({ newMessage: message }),
  sendMessage: () => {
    const { newMessage, messages } = get();
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now(), // This will now be a number as expected
      text: newMessage,
      sender: 'performer',
      timestamp: new Date()
    };
    
    set({
      messages: [...messages, newMsg],
      newMessage: ''
    });
  }
}));