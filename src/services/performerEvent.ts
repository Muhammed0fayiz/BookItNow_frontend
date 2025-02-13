import axiosInstance from "@/shared/axiousintance";
import {PerformerEventHistory} from './../types/performerEvents'
import { PerformerUpcomingEvent } from "@/types/store";
export const blockUnblockPerformerEvent = async (eventId: string) => {
  try {
    const response = await axiosInstance.put(
      `/performerEvent/blockUnblockEvents/${eventId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlockedEventDetails = async (eventId: string) => {
  try {
    const response = await axiosInstance.get(
      `/performerEvent/getEvent/${eventId}`, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePerformerEvent = async (eventId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/performerEvent/deleteEvent/${eventId}`,{ withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPEvent = async (performerId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/performerEvent/uploadEvents/${performerId}`,
      formData,{ withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
















export const getEditEvent = async (eventId: string) => {
    try {

        console.log('fayiz')
      const response = await axiosInstance.get(`/performerEvent/getEvent/${eventId}`,{ withCredentials: true });
      console.log('rs',response);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const editEvent = async (performerId: string, eventId: string, formData: FormData) => {
    try {
      const response = await axiosInstance.put(
        `/performerEvent/editEvent/${performerId}/${eventId}`,
        
        formData,{ withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
  export const fetchPerformerEventHistory = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/performerEvent/eventhistory/${userId}`, {
        withCredentials: true
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to fetch event history");
      }
  
      return {
        events: response.data.events.map((event: PerformerEventHistory) => ({
          ...event,
          date: new Date(event.date).toISOString(),
          createdAt: new Date(event.createdAt).toISOString(),
          updatedAt: new Date(event.updatedAt).toISOString(),
        })),
        totalCount: response.data.totalCount
      };
    } catch (error) {
      console.error("Error fetching event history:", error);
      throw error;
    }
  };
  
  export const fetchPerformerEvents = async (userId: string) => {
    try {
      const response = await axiosInstance.get(
        `/performerEvent/getPerformerEvents/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch events"
      );
    }
  };



  
  export const fetchUpcomingEvents = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/performerEvent/upcomingevents/${userId}`, { withCredentials: true });
      
      const events: PerformerUpcomingEvent[] = response.data.events.map((event: PerformerUpcomingEvent) => ({
        ...event,
        date: new Date(event.date).toISOString(),
        createdAt: new Date(event.createdAt).toISOString(),
        updatedAt: new Date(event.updatedAt).toISOString(),
      }));
  
      return { events, totalCount: response.data.totalCount };
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  };
  
  


  export const appealBlockedEvent = async (eventId: string, performerEmail: string, appealMessage: string) => {
    return axiosInstance.post(`/performerEvent/appealBlockedEvent/${eventId}/${performerEmail}`, {
      appealMessage,
    });
  };
  


