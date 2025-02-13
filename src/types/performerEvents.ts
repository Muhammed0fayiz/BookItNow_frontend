export interface PerformerEventHistory {
    _id: string;
    imageUrl?: string;
    title: string;
    date: string;
    time: string;
    place: string;
    category: string;
    bookingStatus: string;
    price: number;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
  }