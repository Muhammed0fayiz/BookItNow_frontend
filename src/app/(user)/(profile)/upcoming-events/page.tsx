'use client'

import React, { useState, useEffect } from 'react';
import { useUpcomingEventsStore } from '@/store/useUserUpcomingEvents';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { UpcomingEvent } from '@/types/store';
import axiosInstance from '@/shared/axiousintance';
import CancelEventModal from '@/component/cancelEventModal';
import { loginImage } from '@/datas/logindatas';

interface UserProfile {
  username?: string;
  profileImage?: string;
}

const UpcomingEvents: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { upcomingEvents, fetchAllEvents } = useUpcomingEventsStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCancelEvent = async (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const confirmCancellation = async () => {
    if (!selectedEvent) return;
    
    try {
      setCancellingEventId(selectedEvent._id);
      const response = await axiosInstance.post(`/cancelevent/${selectedEvent._id}`,{withCredentials:true});
  
     
    } catch (error) {
      console.error('Error cancelling event:', error);
      
      alert('Failed to cancel event. Please try again.');
    } finally {
      setCancellingEventId(null);
      setIsModalOpen(false);
      setSelectedEvent(null);
      fetchAllEvents()
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return 'Time not available';
      
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return timeString;
    } catch (error) {
      console.log('Time parsing error:', error);
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.log('Date parsing error:', error);
      return 'Date not available';
    }
  };
  const handleProfileClick = () => {
    router.replace('/profile');
  };
  const getEventCardClass = (status: string) => {
    const baseClasses = "bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 relative";
    return status === 'cancelled' 
      ? `${baseClasses} opacity-90` 
      : baseClasses;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 h-16">
        <a href="/home">
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
        </a>
        <div className="flex space-x-4 items-center">
          <a href="/chat" className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
            <i className="fas fa-comments"></i>
          </a>
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 z-40 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-24`}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
            <img
      src={userProfile?.profileImage || loginImage.img}
      alt="User Avatar"
      className="w-full h-full object-cover"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = loginImage.img;
      }}
      onClick={handleProfileClick}
    />
            </div>
            <div>
              <h3 className="text-md font-semibold">{userProfile?.username || 'Guest'}</h3>
              <span className="text-sm font-light">User</span>
            </div>
          </div>
          <ul className="space-y-6">
  <li>
    <a href="/upcoming-events" className="block text-lg hover:bg-white/10 p-3 rounded-md transition duration-300 text-white hover:text-gray-100">
      Upcoming Events
    </a>
  </li>
  <li>
    <a href="/event-history" className="block text-lg hover:bg-white/10 p-3 rounded-md transition duration-300 text-white hover:text-gray-100">
      Event History
    </a>
  </li>
  <li>
    <a href="/favorite-events" className="block text-lg hover:bg-white/10 p-3 rounded-md transition duration-300 text-white hover:text-gray-100">
              Favorite-events
              </a>
            </li>
  <li>
    <a href="/user-wallet" className="block text-lg hover:bg-white/10 p-3 rounded-md transition duration-300 text-white hover:text-gray-100">
      My Wallet
    </a>
  </li>
  <li>
    <button 
      onClick={handleLogout}
      className="w-full text-left block text-lg hover:bg-white/10 p-3 rounded-md transition duration-300 text-white hover:text-gray-100"
    >
      Sign Out
    </button>
  </li>
</ul>
        </aside>

        {/* Events Section */}
        <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : ''} p-4 mt-2`}>
          <div className="grid grid-cols-1 ml-[250px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingEvents && upcomingEvents.map((event: UpcomingEvent) => (
              <div 
                key={event._id}
                className={getEventCardClass(event.bookingStatus)}
              >
                {/* Cancelled Overlay */}
                {event.bookingStatus === 'cancelled' && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-30 z-10 flex flex-col items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-md transform -rotate-12 shadow-lg">
                      <span className="text-lg font-bold">CANCELLED</span>
                    </div>
                  </div>
                )}

                <div className="relative h-32">
                  <img
                    src={event.imageUrl || "/event-placeholder.jpg"}
                    alt={event.title}
                    className={`w-full h-full object-cover ${event.bookingStatus === 'cancelled' ? 'filter grayscale' : ''}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/event-placeholder.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${event.bookingStatus === 'cancelled' 
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'}`}>
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className={`p-4 ${event.bookingStatus === 'cancelled' ? 'opacity-75' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {event.description}
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
                      <span className="text-xs ml-2">{event.teamLeaderNumber}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-600">Price</span>
                      <p className={`text-base font-bold ${
                        event.bookingStatus === 'cancelled' 
                          ? 'text-gray-500 line-through' 
                          : 'text-blue-600'
                      }`}>
                        ₹{event.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-600 mb-1">Booking Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${event.bookingStatus === 'canceled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                        }`}>
                        {event.bookingStatus}
                       
                        <div>

</div>

                      </span>
                    </div>
                  </div>
              

                  {/* Display either Cancel Button or Cancelled Message */}
                  {event.bookingStatus === 'canceled' ? (
                    <div className="mt-4 w-full py-2 px-4 rounded-md bg-red-100 text-red-600 text-sm text-center font-medium">
                      Event Cancelled
                    </div>
                  ) : (
                    <button
                    onClick={() => handleCancelEvent(event)}
                    disabled={cancellingEventId === event._id}
                    className={`mt-4 w-full py-2 px-4 rounded-md text-white text-sm font-medium
                      ${cancellingEventId === event._id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 transition-colors duration-300'
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
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
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