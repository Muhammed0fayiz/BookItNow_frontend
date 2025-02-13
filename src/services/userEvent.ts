
import { EventBookingPeriod, PaymentIntent } from './../types/user';
import axiosInstance from "@/shared/axiousintance";
import type { FavoriteEvent, Performer, UpcomingEvent } from "@/types/store"
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
    console.log('123',response.data)
    return response.data;
  } catch (error) {
    console.error("Error booking event:", error);
    throw error;
  }
};







export const fetchAllPerformers = async (userId: string): Promise<Performer[]> => {
  try {
    const response = await axiosInstance.get<{ data: Performer[] }>(`/userEvent/getperformers/${userId}`, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch performers');
  }
};

export const getPerformerData = async (performerId: string) => {
  try {
    const [performerRes, eventsRes] = await Promise.all([
      axiosInstance.get(`/userEvent/getPerformer/${performerId}`),
      axiosInstance.get(`/userEvent/getPerformerEvents/${performerId}`)
    ]);

    return {
      performer: performerRes.data.performer,
      events: eventsRes.data.data
    };
  } catch (error) {
    console.error("Error fetching performer data:", error);
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



export const fetchPerformers = async (userId: string): Promise<Performer[]> => {
  try {
    const response = await axiosInstance.get<{ data: Performer[] }>(
      `/userEvent/getperformers/${userId}`,
      { withCredentials: true }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching performers:', error);
    throw error;
  }
};
export const fetchFavoriteEvents = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/userEvent/favorites/${userId}`, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const data = response.data.data;
    const totalCount = response.data.totalCount; // Assuming the API returns totalCount

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: Expected an array.');
    }

    const favorites: FavoriteEvent[] = data.map((event: FavoriteEvent) => ({
      ...event,
      createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : null,
      updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : null,
    }));

    return { favorites, totalCount };
  } catch (error) {
    console.error('Error fetching favorite events:', error);
    throw error;
  }
};



export const fetchTopRatedEvents = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/userEvent/top-rated-event/${userId}`, { withCredentials: true });

    console.log('res', response);

    if (response.status === 200) {
      return response.data.data || [];
    }

    throw new Error('Failed to fetch top-rated events');
  } catch (error) {
    console.error('Error fetching top-rated events:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};



export const fetchUserEventHistory = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/userEvent/eventHistory/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
};
export const fetchUpcomingEvents = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/userEvent/upcomingevents/${userId}`, { withCredentials: true });

    return {
      events: response.data.events.map((event: UpcomingEvent) => ({
        ...event,
        date: new Date(event.date).toISOString(),
        createdAt: new Date(event.createdAt).toISOString(),
        updatedAt: new Date(event.updatedAt).toISOString(),
      })),
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};