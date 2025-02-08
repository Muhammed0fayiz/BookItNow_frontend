
import { EventBookingPeriod, PaymentIntent } from './../types/user';
import axiosInstance from "@/shared/axiousintance";
import type { UpcomingEvent } from "@/types/store"
import { AvailabilityResponse } from "@/types/user";



export const fetchEventHistory = async (userId: string, page: number): Promise<UpcomingEvent[]> => {
    try {
      const response = await axiosInstance.get(`/userEvent/userEventHistory/${userId}?page=${page}`, {
        withCredentials: true,
      });
  
      return response.data.events.pastEventHistory.map((event: UpcomingEvent) => ({
        ...event,
        date: new Date(event.date).toISOString(),
        createdAt: new Date(event.createdAt).toISOString(),
        updatedAt: new Date(event.updatedAt).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching event history:', error);
      throw error;
    }
  };

  export const toggleFavoriteEvent = async (userId: string, eventId: string) => {
    try {
      const response = await axiosInstance.post(`/userEvent/toggleFavoriteEvent/${userId}/${eventId}`);
      return response.status === 200;
    } catch (error) {
      console.error('Error toggling favorite event:', error);
      throw error;
    }
  };


export const fetchUserUpcomingEvents = async (userId: string, page: number): Promise<UpcomingEvent[]> => {
  try {
    const response = await axiosInstance.get(`/userEvent/userUpcomingEvents/${userId}?page=${page}`, {
      withCredentials: true,
    });

    return response.data.events.map((event: UpcomingEvent) => ({
      ...event,
      date: new Date(event.date).toISOString(),
      createdAt: new Date(event.createdAt).toISOString(),
      updatedAt: new Date(event.updatedAt).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};



export const cancelUserEvent = async (eventId: string) => {
  try {
    const response = await axiosInstance.post(`/userEvent/cancelevent/${eventId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling event:', error);
    throw error;
  }
};

export const addEventRating = async (eventId: string, rating: number, review?: string) => {
  try {
    const response = await axiosInstance.post(
      `/userEvent/add-rating/${eventId}`,
      { eventId, rating, review },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};



export const getFilteredEvents = async (
  userId: string,
  category: string,
  order: string,
  page: number,
  search: string
) => {
  try {
    const response = await axiosInstance.get(`/userEvent/getFilteredEvents/${userId}`, {
      params: {
        category: category !== "all" ? category : undefined,
        order,
        page,
        search: search || undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching filtered events:", error);
    throw error;
  }
};

export const getFilteredPerformers = async (
  userId: string,
  order: string,
  page: number,
  search: string
) => {
  try {
    const response = await axiosInstance.get(`/userEvent/getFilteredPerformers/${userId}`, {
      params: {
        order,
        page,
        search: search || undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching filtered performers:", error);
    throw error;
  }
};


export const checkAvailability = async (
  formData: FormData,
  eventId: string,
  performerId: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<AvailabilityResponse>(
      "/userEvent/checkavailable",
      { formData, eventId, performerId, userId },
      { withCredentials: true }
    );

    return response.data.data; 
  } catch (error) {
    console.error("Availability check failed:", error);
    throw new Error("Error checking availability. Please try again.");
  }
};





export const checkEventAvailability = async (
  formData: EventBookingPeriod,
  eventId: string,
  performerId: string,
  userId: string
) => {
  try {
    const response = await axiosInstance.post<AvailabilityResponse>(
      "/userEvent/checkavailable",
      {
        formData,
        eventId,
        performerId,
        userId,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};

export const processWalletPayment = async (
  formData: EventBookingPeriod,
  eventId: string,
  performerId: string,
  userId: string,
  amount: number
) => {
  try {
    const response = await axiosInstance.post(
      "/userEvent/walletPayment",
      {
        formData,
        eventId,
        performerId,
        userId,
        amount,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing wallet payment:", error);
    throw error;
  }
};

export const bookEvent = async (
  formData: EventBookingPeriod,
  eventId: string,
  performerId: string,
  userId: string,
  paymentIntent: PaymentIntent
) => {
  try {
    const response = await axiosInstance.post(
      "/userEvent/events/book",
      {
        formData,
        eventId,
        performerId,
        userId,
        paymentIntent,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error booking event:", error);
    throw error;
  }
};





export const fetchAllEvents = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/userEvent/getAllEvents/${userId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

