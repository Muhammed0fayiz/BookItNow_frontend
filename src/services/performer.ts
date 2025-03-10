import { PerformerProfileData } from './../types/performer';

import { LoginCredentials } from './../types/user';
import axiosInstance from '@/shared/axiousintance';



export const performerLogin = async (loginData: LoginCredentials) => {
  try {
    const response = await axiosInstance.post('/performer/login', loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const downloadPerformerReport = async (performerId: string, startDate: string, endDate: string) => {
  try {
    const response = await axiosInstance.get(`/performer/downloadReport/${performerId}`, {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addSlot = async (userId: string, date: Date) => {
  try {
    const response = await axiosInstance.post(
      `/performer/updateSlotStatus/${userId}`,
      { date: date.toISOString(), action: 'add' },
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    throw new Error('Error adding slot: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}


export const removeSlotFromServer = async (userId: string, date: Date) => {
  try {
    const response = await axiosInstance.post(`/performer/updateSlotStatus/${userId}`, {
      date: date.toISOString(),
      action: 'remove'
    });
    return response.data;  // Return the response from the server
  } catch (error) {
    console.error("Error removing slot:", error);
    throw new Error('Failed to remove slot');
  }
};


export const cancelEvent = async (eventId: string) => {
  try {
    const response = await axiosInstance.post(
      `/performerEvent/cancelEvent/${eventId}`,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    throw new Error('Error canceling event: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};


export const fetchEvents = async (performerId: string | undefined, page: number) => {
  if (!performerId) {
    throw new Error("Performer ID is missing");
  }

  try {
    const response = await axiosInstance.get(
      `/performerEvent/performerUpcomingEvents/${performerId}?page=${page}`,
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    throw new Error('Error fetching events: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const removeSlot = async (slotId: string, userId: string) => {
  try {
    const response = await axiosInstance.post(`/remove-slot/${slotId}`, {
      userId,
    });

    return response.data;
  } catch (error) {
    console.error('Error removing slot:', error);
    throw error;
  }
};


export const fetchPerformerDetails = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/performer/performerAllDetails/${userId}`,
      { withCredentials: true }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch performer details");
    }

    return response.data.performerDetails;
  } catch (error) {
    console.error("Error fetching performer details:", error);
    throw error;
  }
};







export const getSlotDetails = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/performer/getslot/${userId}`, {
      withCredentials: true,
    });

    console.log('Response:', response);
    return response.data?.data || {}; 
  } catch (error) {
    console.error('Error fetching slot details:', error);
    throw error;
  }
};



export const getPerformerDetails = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/performer/getPerformer/${userId}`, {
      withCredentials: true,
    });
    return response.data.response;
  } catch (error) {
    console.error('Failed to fetch performer details:', error);
    throw error;
  }
};




export const appealBlockedEvent = async (eventId: string, appealMessage: string) => {
  try {
    const response = await axiosInstance.post(`/performer/appealBlockedEvent/${eventId}`, {
      appealMessage,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting appeal:', error);
    throw error;
  }
};

export const updatePerformerProfile = async (
  userId: string,
  formData: PerformerProfileData,
  imageUrl: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put(`/performer/updatePerformerProfile/${userId}`, {
      ...formData,
      profileImage: imageUrl,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

