// import { ReactNode } from "react";

// // types/store.ts
// export interface PerformerDetails {
//   PId: string; // Add this line if missing
//   userId: string;  // Add userId here
//   imageUrl: any;
//   bandName: string;
//   place: string;
//   rating: number;
//   description: string;
//   image: string;  // Changed from profilePic to match component usage
//   genre: string;  // Added to match component usage
//   totalReviews?: number;
//   walletBalance?: number;
//   mobileNumber: string;
// }





// export interface PerformerStats {
//   upcomingEvents: number;
//   pastEvents: number;
//   walletBalance: number;
//   totalReviews: number;
// }

// export interface ChatMessage {
//   content: ReactNode;
//   id: number;
//   text: string;
//   sender: 'user' | 'performer';
//   timestamp: Date;
// }

// export interface ChatState {
//   messages: ChatMessage[];
//   newMessage: string;
//   setNewMessage: (message: string) => void;
//   sendMessage: () => void;
// }

// export interface PerformerStore {
//   performerDetails: PerformerDetails | null;
//   stats: PerformerStats;
//   messages: ChatMessage[];
//   sidebarOpen: boolean;
//   chatOpen: boolean;
//   newMessage: string;
//   fetchPerformerDetails: () => Promise<void>;
//   toggleSidebar: () => void;
//   toggleChat: () => void;
//   sendMessage: (message: string) => void;
//   handleLogout: () => void;
// }
// .....................................................................................

// 

export interface PerformerDetails {
  PId: string;
  userId: string;
  bandName: string;
  place: string;
  rating: number;
  description: string;
  image: string;
  genre: string;
  totalReviews: number;
  walletBalance: number;
  imageUrl?: string;
  mobileNumber: string;
}

export interface PerformerStats {
  upcomingEvents: number;
  pastEvents: number;
  walletBalance: number;
  totalReviews: number;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'performer' | 'user'; // Define other senders if needed
  timestamp: Date;
  content?: string; // Optional content if needed
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

export interface PerformerEventsStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalEarnings: number;
  averageRating: number;
}
// Event interface to match MongoDB document structure
export interface Events {
  id: number;
  _id?: string;
  title: string;
  category: string;
  userId: string;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;

}

export interface PerformerEventsStore {
  events: Event[];
  stats: PerformerEventsStats;
  isLoading: boolean;
  error: string | null;
  
  fetchPerformerEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, '_id'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  fetchPerformerEventStats: () => Promise<void>;
}

