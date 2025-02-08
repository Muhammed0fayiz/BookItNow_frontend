"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/component/performersidebar";
import Image from "next/image";
import { useUIStore } from "@/store/useUIStore";

import usePerformerStore from "@/store/usePerformerStore";
import { useUpcomingEventsStore } from "@/store/useperformerupcomingevent";
import useChatNotifications from "@/store/useChatNotification";
import { cancelEvent, fetchEvents } from "@/services/performer";

interface PerformerId {
  _id: string;
}

interface PerformerUpcomingEvent {
  _id: string;
  title: string;
  category: string;
  userId: string;
  performerId: PerformerId;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
  isblocked: boolean;
  advancePayment: number;
  restPayment: number;
  time: string;
  place: string;
  date: string;
  bookingStatus: string;
  isRated: boolean;
  createdAt: string;
  updatedAt: string;
  count: number;
}

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

// Utility functions
const formatTime = (timeString: string): string => {
  try {
    if (!timeString) return "Time not available";

    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return timeString;
  } catch (error) {
    console.error("Time parsing error:", error);
    return "Time not available";
  }
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Date not available";
  }
};

// Event card component
const EventCard: React.FC<{
  event: PerformerUpcomingEvent;
  onCancel: (eventId: string, eventDate: string) => void;
  cancelConfirmation: { [key: string]: boolean };
  setCancelConfirmation: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}> = ({ event, onCancel, cancelConfirmation, setCancelConfirmation }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    {event.imageUrl && (
      <Image
        src={event.imageUrl}
        alt={event.title}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Date:</strong> {formatDate(event.date)}
        </p>
        <p>
          <strong>Time:</strong> {formatTime(event.time)}
        </p>
        <p>
          <strong>Place:</strong> {event.place}
        </p>
        <p>
          <strong>Category:</strong> {event.category}
        </p>
        <p>
          <strong>Status:</strong> {event.bookingStatus}
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-green-600 font-medium">₹{event.price}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            event.status === "Confirmed"
              ? "bg-green-100 text-green-800"
              : event.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {event.status}
        </span>
      </div>

      {event.bookingStatus !== "canceled" && (
        <CancelEventButton
          event={event}
          onCancel={onCancel}
          cancelConfirmation={cancelConfirmation}
          setCancelConfirmation={setCancelConfirmation}
        />
      )}
    </div>
  </div>
);

// Cancel event button component
const CancelEventButton: React.FC<{
  event: PerformerUpcomingEvent;
  onCancel: (eventId: string, eventDate: string) => void;
  cancelConfirmation: { [key: string]: boolean };
  setCancelConfirmation: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}> = ({ event, onCancel, cancelConfirmation, setCancelConfirmation }) => {
  const eventDateTime = new Date(event.date);
  const currentDate = new Date();
  const daysDifference = Math.ceil(
    (eventDateTime.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  if (daysDifference < 5) {
    return (
      <div className="mt-4 text-red-500 text-sm text-center">
        Cannot cancel event.
      </div>
    );
  }

  if (cancelConfirmation[event._id]) {
    return (
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onCancel(event._id, event.date)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Confirm
        </button>
        <button
          onClick={() =>
            setCancelConfirmation((prev) => {
              const newState = { ...prev };
              delete newState[event._id];
              return newState;
            })
          }
          className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-200"
        >
          Keep Event
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        setCancelConfirmation((prev) => ({ ...prev, [event._id]: true }))
      }
      className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
    >
      Cancel Event
    </button>
  );
};
// UpcomingEvents component
const UpcomingEvents: React.FC = () => {
  const { performerupcomingEvents, fetchAllEvents, totalCount } =
    useUpcomingEventsStore();
  const [cancelConfirmation, setCancelConfirmation] = useState<{
    [key: string]: boolean;
  }>({});
  const [events, setEvents] = useState<PerformerUpcomingEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();

  const handleCancelEvent = async (eventId: string, eventDate: string) => {
    try {
      const eventDateTime = new Date(eventDate);
      const currentDate = new Date();
      const daysDifference = Math.ceil(
        (eventDateTime.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
      );

      if (daysDifference < 5) {
        alert(
          "You cannot cancel events less than 6 days before the event date."
        );
        return;
      }

      if (!cancelConfirmation[eventId]) {
        setCancelConfirmation((prev) => ({ ...prev, [eventId]: true }));
        return;
      }

      const response = await cancelEvent(eventId);

      if (response.status === 200) {
        fetchAllEvents();
        setCancelConfirmation((prev) => {
          const newState = { ...prev };
          delete newState[eventId];
          return newState;
        });
      }
    } catch (error) {
      console.error("Error canceling the event:", error);
      alert("Failed to cancel the event. Please try again.");
    }
  };

  const paginationEvent = async (page: number) => {
    try {
      setIsLoadingEvents(true);
      const response = await fetchEvents(performerDetails?.userId, page); // API call moved to service

      if (response.events) {
        const formattedEvents = response.events.map(
          (event: PerformerUpcomingEvent) => ({
            ...event,
            date: new Date(event.date).toISOString(),
            createdAt: new Date(event.createdAt).toISOString(),
            updatedAt: new Date(event.updatedAt).toISOString(),
          })
        );
        setEvents(formattedEvents);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events. Please try again.");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    const pages = Math.ceil(totalCount / 8);
    setTotalPages(pages);
  }, [totalCount]);

  useEffect(() => {
    if (performerupcomingEvents) {
      setEvents(performerupcomingEvents);
    }
  }, [performerupcomingEvents]);

  useEffect(() => {
    fetchPerformerDetails();
    fetchAllEvents();
  }, [fetchPerformerDetails, fetchAllEvents]);

  return (
    <DashboardSection title="Upcoming Events">
      {events.length === 0 ? (
        <p className="text-gray-500 text-center">No upcoming events</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onCancel={handleCancelEvent}
                cancelConfirmation={cancelConfirmation}
                setCancelConfirmation={setCancelConfirmation}
              />
            ))}
          </div>

          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => paginationEvent(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoadingEvents}
              className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                        bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginationEvent(i + 1)}
                disabled={isLoadingEvents}
                className={`px-4 py-2 rounded-md text-sm font-medium
                  ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors duration-300`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                paginationEvent(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || isLoadingEvents}
              className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                        bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </DashboardSection>
  );
};

// Main PerformerDashboard component
const PerformerUpcomingEvents: React.FC = () => {
  const router = useRouter();
  const { fetchAllEvents } = useUpcomingEventsStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();

  const { totalUnreadMessage, fetchNotifications } = useChatNotifications();

  useEffect(() => {
    fetchNotifications().catch((err) =>
      console.error("Error fetching notifications:", err)
    );
  }, [fetchNotifications]);

  useEffect(() => {
    fetchPerformerDetails();
    fetchAllEvents();
  }, [fetchPerformerDetails, fetchAllEvents]);

  const handleLogout = () => {
    document.cookie = "userToken=; Max-Age=0; path=/;";
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-64">
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-10">
          <div className="flex items-center">
            <button
              className="md:hidden text-blue-600 mr-4"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
            <a
              href="/chatsession"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z"
                />
              </svg>
              {totalUnreadMessage > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalUnreadMessage}
                </span>
              )}
            </a>
          </div>
        </nav>

        <main className="pt-20 p-6">
          <UpcomingEvents />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default PerformerUpcomingEvents;
