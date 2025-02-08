import mongoose from "mongoose";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData{
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AvailabilityResponse {
  data: boolean;
}

export interface EventBookingPeriod {
  date: string;
  time: string;
  place: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface UserApiResponse {
  _id: string;
  username: string;
  email: string;
  isblocked: boolean;
  isVerified: boolean;
}

 export interface PerformerApiResponse {
  _id: string;
  userId: {
      _id: mongoose.Types.ObjectId;
      toString: () => string;
      isBlocked: boolean;
  };
  bandName: string;
  mobileNumber: string;
  rating: number;
}

export interface Message {
  _id: string;
  roomId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  role?: string;
}

export interface ChatRoom {
  profileImage: string;
  userName: string;
  performerName: string;
  myId: string;
  otherId: string;
}