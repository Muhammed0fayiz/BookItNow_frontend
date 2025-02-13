import axiosInstance from "@/shared/axiousintance";
import { PerformerApiResponse, UserApiResponse } from "@/types/user";
import axios from "axios";
import { Events } from '@/types/store';
export const checkSession = async () => {
    try {
      const response = await axiosInstance.get('/admin/checkSession', { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error; 
    }
  };



  


  export const adminLogin = async (adminLoginData: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/admin/adminLogin', adminLoginData);
      return response.data; // Return response directly
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };


  export const adminLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
      return response.data; // Return response directly
    } catch (error) {
      throw new Error('Error during logout');
    }
  };
  

  export const downloadAdminReport = async (startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.get('/admin/downloadReport', {
        params: { startDate, endDate },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to download report');
    }
  };
  
  
  export const checkAdminSession = async () => {
    try {
      const response = await axiosInstance.get('/admin/checkSession');
      return response.data.isAuthenticated;
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  };
  




  export const fetchRevenueData = async (page: number) => {
    try {
      const response = await axiosInstance.get('/admin/getRevenue', {
        params: { page },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch revenue data');
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  export const fetchUsers = async (): Promise<UserApiResponse[]> => {
    try {
      const response = await axiosInstance.get<UserApiResponse[]>('/admin/getUsers');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  };
  
  export const fetchPerformers = async (): Promise<PerformerApiResponse[]> => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: PerformerApiResponse[] }>('/admin/performers');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch performers');
    } catch (error) {
      throw new Error('Failed to fetch performers');
    }
  };
  export const updateStatus = async (id: string, isBlocked: boolean, isUser: boolean): Promise<void> => {
    try {
      const endpoint = isUser ? `/admin/updateUserStatus/${id}` : `/admin/updatePerformerStatus/${id}`;
      await axiosInstance.post(endpoint, { isBlocked });
    } catch (error) {
      throw new Error('Failed to update status');
    }
  };


export const getTempPerformers = async () => {
  try {
    const response = await axiosInstance.get('/admin/getTempPerformers');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching performers:', error);
    return [];
  }
};



export const grantPerformerPermission = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/admin/grant-performer-permission/${id}`, {
      isVerified: true,
      isRejected: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error granting performer permission:', error);
    throw error;
  }
};

// Reject performer permission
export const rejectPerformerPermission = async (id: string, rejectReason: string) => {
  try {
    const response = await axiosInstance.post(`/admin/reject-performer-permission/${id}`, {
      isVerified: false,
      isRejected: true,
      rejectReason,
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting performer permission:', error);
    throw error;
  }
};

export const fetchTempPerformers = async () => {
  try {
    const response = await axiosInstance.get('/admin/getTempPerformers');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching performers:', error);
    throw error; 
  }
};


export const fetchAdminDetailsApi = async () => {
  try {
    const response = await axiosInstance.get("/admin/details", { withCredentials: true });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch admin details');
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};

export const fetchAllEvents = async () => {
  try {
    const response = await axiosInstance.get('/admin/getAllEvents');
    return response.data || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch events");
  }
};

export const blockEvent = async (eventId: string, duration: string, reason: string) => {
  try {
    const response = await axiosInstance.post(`/admin/blockUnblockEvents/${eventId}`, {
      duration,
      reason,
      action: 'block'
    });

    return response.data;
  } catch (error) {
    console.error('Error blocking event:', error);
    throw error;
  }
}


export const unblockEvent = async (eventId: string) => {
  try {
    const response = await axiosInstance.post(`/admin/blockUnblockEvents/${eventId}`, {
      action: 'unblock'
    });

    return response.data;
  } catch (error) {
    console.error('Error unblocking event:', error);
    throw error;
  }
};


export const fetchAllAdminEvents = async (): Promise<Events[]> => {
  try {
    const response = await axiosInstance.get('/admin/getAllEvents');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching admin events:', error);
    throw error;
  }
};