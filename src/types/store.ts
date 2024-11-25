

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'performer' | 'user'; // Define other senders if needed
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];  // Array of chat messages
  newMessage: string;       // Current message input
  setNewMessage: (message: string) => void; // Method to set a new message
  sendMessage: () => void;  // Method to send the message
}


export interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  toggleSidebar: () => void;
  toggleChat: () => void;
}

// Other existing interfaces

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
  isListed: boolean;
  createdAt:string;
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
  isblocked:boolean;
  isperformerblockedevents:boolean

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

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isBlocked: boolean;
  isPerformerBlocked: boolean;
  walletBalance: number;
  profileImage?: string;
  waitingPermission:boolean;
}

export interface UserStore {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  toggleUserVerification: (userId: string) => Promise<void>;
  handleLogout: () => void;
}


export interface Performer {

  createdAt: string | number | Date;
  imageUrl: string | undefined;

  userId: string;
  bandName: string;
  mobileNumber: string;
  rating: number;
  description: string;
  profileImage?: string;
  totalReviews?: number;
  walletBalance?: number;
  place?: string;
  bookingStatus?: string;
}

export interface PerformerId {
  _id: string;
}

export interface UpcomingEvent {
  _id: string;
  title: string;
  category: string;
  userId: string;
  performerId: PerformerId;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
  isblocked: boolean;
  advancePayment: number;
  restPayment: number;
  time: string;
  place: string;
  date: string;
  bookingStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpcomingEventsStore {
  upcomingEvents: UpcomingEvent[];
  isLoading: boolean;
  error: string | null;
  fetchAllEvents: () => Promise<void>;
  removeUpcomingEvent: (eventId: string) => void;
  getUserIdFromToken: () => string | null;
}
export interface AdminDetails {
  walletAmount: number | null;
  walletTransactionHistory: Record<string, number>;
  totalUsers: number | null;
  userRegistrationHistory: Record<string, number>;
  totalPerformers: number | null;
  performerRegistrationHistory: Record<string, number>;
}
export interface WalletDocument {
  _id: string;
  userId: string;
  amount: number;
  transactionType: 'debit' | 'credit';
  role: 'user' | 'performer';
  date: string;
  description: string;
}
