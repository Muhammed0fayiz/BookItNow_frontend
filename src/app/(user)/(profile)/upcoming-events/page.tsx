"use client";

import React, { useState, useEffect } from "react";
import { useUpcomingEventsStore } from "@/store/useUserUpcomingEvents";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useUserStore from "@/store/useUserStore";
import { UpcomingEvent } from "@/types/store";
import CancelEventModal from "@/component/cancelEventModal";
import { Calendar } from "lucide-react";
import useChatNotifications from "@/store/useChatNotification";
import DescriptionViewer from "@/component/descriptionViewer";
import Sidebar from "@/component/userSidebar";
import Navbar from "@/component/userNavbar";
import Image from "next/image";
import { cancelUserEvent, fetchUserUpcomingEvents } from "@/services/userEvent";
const UpcomingEvents: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { upcomingEvents, fetchAllEvents, totalCount } =
    useUpcomingEventsStore();
  const { userProfile, isLoading, error, fetchUserProfile, handleLogout } =
    useUserStore();
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(
    null
  );
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
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
    const pages = Math.ceil(totalCount / 9);
    setTotalPages(pages);
  }, [totalCount]); // Removed upcomingEvents from dependencies

  const handlePreviousClick = () => {
    const newPage = Math.max(1, currentPage - 1);
    userUpcomingEvents(newPage);
  };

  const handleNextClick = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    userUpcomingEvents(newPage);
  };

  const userUpcomingEvents = async (page: number) => {
    try {
      if (!userProfile?.id) {
        throw new Error("User ID is missing");
      }

      console.log("Fetching events for page:", page);
      setIsLoadingEvents(true);

      const events = await fetchUserUpcomingEvents(userProfile.id, page);

      setEvents(events);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleCancelEvent = async (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!selectedEvent) return;

    try {
      setCancellingEventId(selectedEvent._id);

      const response = await cancelUserEvent(selectedEvent._id);
      console.log("Cancellation response:", response);
    } catch (error) {
      alert("Failed to cancel event. Please try again.");
    } finally {
      setCancellingEventId(null);
      setIsModalOpen(false);
      setSelectedEvent(null);
      userUpcomingEvents(currentPage);
    }
  };

  const formatTime = (timeString: string) => {
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
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      {/* Sidebar - Fixed position */}
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

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle="Upcoming Events"
        />

        {/* Main Content */}
        <div className="pt-16 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Upcoming Events
              </h2>
            </div>
            <p className="text-gray-600 ml-11">
              {totalCount > 0
                ? `Showing ${events.length} of ${totalCount} upcoming events`
                : "No upcoming events found"}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events && events.length > 0 ? (
              events.map((event: UpcomingEvent) => (
                <div
                  key={event._id}
                  className={`${getEventCardClass(
                    event.bookingStatus
                  )} hover:shadow-xl transition-all duration-300`}
                >
                  {/* Cancelled Overlay */}
                  {event.bookingStatus === "cancelled" && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-30 z-10 flex flex-col items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-md transform -rotate-12 shadow-lg">
                        <span className="text-lg font-bold">CANCELLED</span>
                      </div>
                    </div>
                  )}

                  <div className="relative h-32">
                    <Image
                      src={event.imageUrl || "/event-placeholder.jpg"}
                      alt={event.title}
                      width={500}
                      height={300}
                      className={`w-full h-full object-cover ${
                        event.bookingStatus === "cancelled"
                          ? "filter grayscale"
                          : ""
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/event-placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2">
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
                    className={`p-4 ${
                      event.bookingStatus === "cancelled" ? "opacity-75" : ""
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      <DescriptionViewer
                        description={event.description}
                        maxLength={7}
                      />
                    </p>

                    <div className="space-y-2">
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
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-user w-4 text-blue-600 text-xs"></i>
                        <span className="text-xs ml-2">{event.teamLeader}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-phone w-4 text-blue-600 text-xs"></i>
                        <span className="text-xs ml-2">
                          {event.teamLeaderNumber}
                        </span>
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

                    {/* Display either Cancel Button or Cancelled Message */}
                    {event.bookingStatus === "canceled" ? (
                      <div className="mt-4 w-full py-2 px-4 rounded-md bg-red-100 text-red-600 text-sm text-center font-medium">
                        Event Cancelled
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancelEvent(event)}
                        disabled={cancellingEventId === event._id}
                        className={`mt-4 w-full py-2 px-4 rounded-md text-white text-sm font-medium
                          ${
                            cancellingEventId === event._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 transition-colors duration-300"
                          }`}
                      >
                        <span className="flex items-center justify-center">
                          <i className="fas fa-times-circle mr-2"></i>
                          Cancel Event
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // No Events State
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-blue-50 rounded-full p-6 mb-4">
                  <Calendar className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  You don&apos;t have any upcoming events scheduled. Browse our
                  events page to find something interesting!
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

            {/* Enhanced Pagination */}
            {/* Enhanced Pagination */}
{totalPages > 1 && (
  <div className="col-span-full flex justify-center items-center mt-8 mb-6">
    <div className="inline-flex items-center justify-center space-x-2">
      <button
        onClick={handlePreviousClick}
        disabled={currentPage === 1 || isLoadingEvents}
        className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                    bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        <i className="fas fa-chevron-left mr-2"></i>
        Previous
      </button>

      <div className="flex items-center space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => userUpcomingEvents(index + 1)}
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
      </div>

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
  </div>
)}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <CancelEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onConfirm={confirmCancellation}
          eventDate={selectedEvent.date}
          eventPrice={selectedEvent.price}
          isLoading={cancellingEventId === selectedEvent._id}
        />
      )}
    </div>
  );
};

export default UpcomingEvents;
