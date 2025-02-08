
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
    return response.data; // Return response data directly
  } catch (error) {
    throw new Error('Error fetching events: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};


