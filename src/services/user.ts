import { Performer } from "@/types/store";
import { LoginCredentials, SignUpData } from "./../types/user";
import axiosInstance, { axiosInstanceMultipart } from "@/shared/axiousintance";

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
    const response = await axiosInstanceMultipart.put(`/updateUserProfile/${userID}`, userProfile, {
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


export const fetchAllPerformers = async (userId: string): Promise<Performer[]> => {
  try {
    const response = await axiosInstance.get<{ data: Performer[] }>(`/userevent/getperformers/${userId}`, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch performers');
  }
};