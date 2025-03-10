import { WalletDocument } from "@/types/store";
import { LoginCredentials, SignUpData } from "./../types/user";
import axiosInstance from "@/shared/axiousintance";

export const userLogin = async (loginData: LoginCredentials) => {
  try {
    const response = await axiosInstance.post("/login", loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    console.log("resend");

    const response = await axiosInstance.post(`/resend-otp/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (signUpData: SignUpData) => {
  try {
    const response = await axiosInstance.post("/signup", signUpData);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const editUserProfile = async (userID: string, userProfile: FormData) => {
  try {
    console.log('hellog',userProfile)
    const response = await axiosInstance.put(`/updateUserProfile/${userID}`,userProfile,{
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const editPassword = async (userID: string, userProfile: FormData) => {
  try {
    const response = await axiosInstance.put(`/updateUserProfile/${userID}`, userProfile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};




export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const response = await axiosInstance.put(
      `/changePassword/${userId}`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};





export const getUserDetails = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/getUser/${userId}`, { withCredentials: true });
    return response.data.response;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};




export const fetchUserDetails = async (senderId:string) => {
  try {
    const response = await axiosInstance.get(`/getUser/${senderId}`, { withCredentials: true });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};




export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/getUser/${userId}`, { withCredentials: true });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};


export const fetchWalletHistory = async (userId: string): Promise<WalletDocument[]> => {
  try {
    const response = await axiosInstance.get(`/getWalletHistory/${userId}`, { withCredentials: true });

    if (response.status === 200) {
      return response.data.data || [];
    }

    throw new Error('Failed to fetch wallet history');
  } catch (error) {
    console.error('Error fetching wallet history:', error);
    throw error;
  }
};