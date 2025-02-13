export interface PerformerResponse {
    userId: string;
    bandName: string;
    place: string;
    rating: number;
    description: string;
    profileImage: string;
    genre?: string;
    totalReviews: number;
    walletBalance: number;
    upcomingEvents?: number;
    pastEvents?: number;
    mobileNumber: string;
  }
