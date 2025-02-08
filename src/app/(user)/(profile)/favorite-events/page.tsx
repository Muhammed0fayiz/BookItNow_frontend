"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { useFavoritesStore } from "@/store/useFavoriteEvents";

import "@fortawesome/fontawesome-free/css/all.min.css";
import useChatNotifications from "@/store/useChatNotification";
import DescriptionViewer from "@/component/descriptionViewer";
import Sidebar from "@/component/userSidebar";
import Navbar from "@/component/userNavbar";
import Image from "next/image";
import { toggleFavoriteEvent } from "@/services/userEvent";
const FavoriteEvents: React.FC = () => {
  const router = useRouter();
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile, handleLogout } =
    useUserStore();
  const { favoriteEvents, fetchfavoriteEvents } = useFavoritesStore();
  const { fetchNotifications } = useChatNotifications();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;
  const totalPages = Math.ceil(favoriteEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = favoriteEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchfavoriteEvents(),
          fetchNotifications(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsAllDataLoaded(true);
      }
    };

    loadInitialData();
  }, [fetchUserProfile, fetchfavoriteEvents, fetchNotifications]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      if (!userProfile?.id) {
        throw new Error("User ID is missing");
      }

      const success = await toggleFavoriteEvent(userProfile.id, eventId);

      if (success) {
        useFavoritesStore.setState((prevState) => ({
          favoriteEvents: prevState.favoriteEvents.filter(
            (event) => event._id !== eventId
          ),
        }));
      }
    } catch (error) {
      console.error("Error removing favorite event:", error);
    }
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
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
      </div>

      <div className="flex-1 md:ml-64">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle="Favorite Events"
        />

        <div className="pt-16 p-6">
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Favorite Events
                </h2>
                <p className="text-gray-600">
                  {favoriteEvents.length > 0
                    ? `Showing ${indexOfFirstEvent + 1}-${Math.min(
                        indexOfLastEvent,
                        favoriteEvents.length
                      )} of ${favoriteEvents.length} favorite events`
                    : "No favorite events found"}
                </p>
              </div>
              <a
                href="/events"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add More</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl || "/event-placeholder.jpg"}
                      alt={event.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/event-placeholder.jpg";
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      <DescriptionViewer
                        description={event.description}
                        maxLength={20}
                      />
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-user w-5 text-blue-600"></i>
                        <span className="text-sm ml-2">{event.teamLeader}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-phone w-5 text-blue-600"></i>
                        <span className="text-sm ml-2">
                          {event.teamLeaderNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      {event.isblocked || event.isperformerblockedevents ? (
                        <span className="text-red-600 text-sm font-semibold">
                          Cannot book
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            router.push(`/events/${event.userId}/${event._id}`)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                        >
                          <i className="fas fa-ticket-alt"></i>
                          <span>Book Now</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveFavorite(event._id || "")}
                        className="text-red-600 hover:text-red-700 transition-colors duration-300"
                      >
                        <i className="fas fa-heart-broken text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-blue-50 rounded-full p-8 mb-6">
                  <i className="fas fa-heart text-blue-600 text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No Favorite Events
                </h3>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                  You haven&apos;t added any events to your favorites yet.
                  Explore our events page to discover amazing experiences!
                </p>

                <a
                  href="/events"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
                >
                  <i className="fas fa-search"></i>
                  <span>Browse Events</span>
                </a>
              </div>
            )}
          </div>

          {/* Pagination */}
          {favoriteEvents.length > eventsPerPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((current) => Math.max(current - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((current) =>
                      Math.min(current + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteEvents;
