
  export interface ChatNotification {
    userId: string;
    numberOfMessages: number;
  }
  
  export interface ChatResponse {
    totalCount: number;
    notifications: ChatNotification[];
  }