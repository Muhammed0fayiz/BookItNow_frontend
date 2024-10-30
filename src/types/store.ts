import { ReactNode } from "react";

// types/store.ts
export interface PerformerDetails {
  PId: string; // Add this line if missing
  userId: string;  // Add userId here
  imageUrl: any;
  bandName: string;
  place: string;
  rating: number;
  description: string;
  image: string;  // Changed from profilePic to match component usage
  genre: string;  // Added to match component usage
  totalReviews?: number;
  walletBalance?: number;
  mobileNumber: string;
}





export interface PerformerStats {
  upcomingEvents: number;
  pastEvents: number;
  walletBalance: number;
  totalReviews: number;
}

export interface ChatMessage {
  content: ReactNode;
  id: number;
  text: string;
  sender: 'user' | 'performer';
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
}

export interface PerformerStore {
  performerDetails: PerformerDetails | null;
  stats: PerformerStats;
  messages: ChatMessage[];
  sidebarOpen: boolean;
  chatOpen: boolean;
  newMessage: string;
  fetchPerformerDetails: () => Promise<void>;
  toggleSidebar: () => void;
  toggleChat: () => void;
  sendMessage: (message: string) => void;
  handleLogout: () => void;
}