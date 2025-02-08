import axiosInstance from "@/shared/axiousintance";

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
  







