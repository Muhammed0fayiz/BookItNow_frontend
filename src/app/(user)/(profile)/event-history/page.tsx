"use client";

import type React from "react";
import { useState, useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import { useUserEventHistory } from "@/store/useUserEventHistory";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RatingModal from "@/component/rating";
import type { UpcomingEvent } from "@/types/store";
import useChatNotifications from "@/store/useChatNotification";
import Sidebar from "@/component/userSidebar";
import Navbar from "@/component/userNavbar";
import Image from "next/image";
import { addEventRating, fetchEventHistory } from "@/services/userEvent";

const EventHistory: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile, handleLogout } =
    useUserStore();
  const { upcomingEvents, fetchAllEvents, totalCount } = useUserEventHistory();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(
    null
  );
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const { fetchNotifications } = useChatNotifications();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchAllEvents(),
          fetchNotifications(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsAllDataLoaded(true);
      }
    };

    loadInitialData();
  }, [fetchUserProfile, fetchAllEvents, fetchNotifications]);

  useEffect(() => {
    if (upcomingEvents) {
      setEvents(upcomingEvents);
    }
  }, [upcomingEvents]);

  useEffect(() => {
    const pages = Math.ceil(totalCount / 8);
    setTotalPages(pages);
  }, [totalCount]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePreviousClick = () => {
    const newPage = Math.max(1, currentPage - 1);
    getEventHistory(newPage);
  };

  const handleNextClick = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    getEventHistory(newPage);
  };

  const getEventHistory = async (page: number) => {
    try {
      setIsLoadingEvents(true);

      if (!userProfile?.id) {
        throw new Error("User ID is missing");
      }

      const events = await fetchEventHistory(userProfile.id, page);

      setEvents(events);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return "Time not available";

      if (timeString.includes(":")) {
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
        return date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      return timeString;
    } catch (error) {
      console.log("Time parsing error:", error);
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.log("Date parsing error:", error);
      return "Date not available";
    }
  };

  const handleRateEvent = (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setIsRatingModalOpen(true);
  };

  const submitRating = async (rating: number, review?: string) => {
    if (!selectedEvent) return;
  
    try {
      await addEventRating(selectedEvent._id, rating, review);
  
      setIsRatingModalOpen(false);
      setSelectedEvent(null);
      await getEventHistory(currentPage); // Refresh event history after rating
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const getEventCardClass = (status: string) => {
    const baseClasses =
      "bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 relative";
    return status === "cancelled" ? `${baseClasses} opacity-90` : baseClasses;
  };

  if (!isAllDataLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 bg-red-100 p-4 rounded-lg">
          <p className="font-semibold">Error loading profile</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => fetchUserProfile()}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          handleLogout={handleLogout}
        />
      </div>

      <div className="flex-1 md:ml-64">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle="Event History"
        />

        <div className="pt-16 p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Event History
              </h2>
            </div>
            <p className="text-gray-600">
              {totalCount > 0
                ? `Showing ${events.length} of ${totalCount} past events`
                : "No past events found"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events && events.length > 0 ? (
              events.map((event: UpcomingEvent) => (
                <div
                  key={event._id}
                  className={`${getEventCardClass(
                    event.bookingStatus
                  )} hover:shadow-xl transition-all duration-300`}
                >
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          event.bookingStatus === "cancelled"
                            ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 flex flex-col justify-between h-64 ${
                      event.bookingStatus === "cancelled" ? "opacity-75" : ""
                    }`}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-calendar-alt w-4 text-blue-600 text-xs"></i>
                        <span className="text-xs ml-2">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-clock w-4 text-blue-600 text-xs"></i>
                        <span className="text-xs ml-2">
                          {formatTime(event.time)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-map-marker-alt w-4 text-blue-600 text-xs"></i>
                        <span className="text-xs ml-2">{event.place}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-600">Price</span>
                        <p
                          className={`text-base font-bold ${
                            event.bookingStatus === "cancelled"
                              ? "text-gray-500 line-through"
                              : "text-blue-600"
                          }`}
                        >
                          ₹{event.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-600 mb-1">
                          Booking Status
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs
                          ${
                            event.bookingStatus === "canceled"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {event.bookingStatus}
                        </span>
                      </div>
                    </div>

                    {event.bookingStatus === "completed" &&
                      event.isRated === false && (
                        <button
                          onClick={() => handleRateEvent(event)}
                          className="mt-4 w-full py-2 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                        >
                          <span className="flex items-center justify-center">
                            <i className="fas fa-star mr-2"></i>
                            Rate Event
                          </span>
                        </button>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-blue-50 rounded-full p-6 mb-4">
                  <i className="fas fa-calendar-alt text-blue-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Past Events
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  You don&apos;t have any past events. Browse our events page to
                  find something interesting!
                </p>

                <a
                  href="/events"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                >
                  <i className="fas fa-search"></i>
                  <span>Browse Events</span>
                </a>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
                <button
                  onClick={handlePreviousClick}
                  disabled={currentPage === 1 || isLoadingEvents}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                                bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => getEventHistory(index + 1)}
                    disabled={isLoadingEvents}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300
                      ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages || isLoadingEvents}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                                bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                >
                  Next
                  <i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={submitRating}
          eventTitle={selectedEvent.title}
          id={selectedEvent._id}
        />
      )}
    </div>
  );
};

export default EventHistory;
