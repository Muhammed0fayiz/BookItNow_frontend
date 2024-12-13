'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import { useUserEventHistory } from '@/store/useUserEventHistory';
import axiosInstance from '@/shared/axiousintance';
import '@fortawesome/fontawesome-free/css/all.min.css';
import RatingModal from '@/component/rating';

const EventHistory: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const { upcomingEvents, fetchAllEvents } = useUserEventHistory();
  
  // New state for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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

  const handleProfileClick = () => {
    router.replace('/profile');
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

  const handleRateEvent = (event: any) => {
    setSelectedEvent(event);
    setIsRatingModalOpen(true);
  };
  const submitRating = async (rating: number, review?: string) => {

    try {
     
      await axiosInstance.post(`/add-rating/${selectedEvent._id}`, {
        eventId: selectedEvent._id,
        rating, 
      });
  
   
      setIsRatingModalOpen(false);
      setSelectedEvent(null);
  

      fetchAllEvents();
    } catch (error) {
      console.error('Error submitting rating:', error);
     
    }
  };
  

  const getEventCardClass = (status: string) => {
    const baseClasses = "bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 relative";
    return status === 'cancelled' 
      ? `${baseClasses} opacity-90` 
      : baseClasses;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'booking':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
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
                src={userProfile?.profileImage || "/default-avatar.png"}
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-avatar.png";
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 ml-[250px]">Event History</h2>
          <div className="grid grid-cols-1 ml-[250px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingEvents && upcomingEvents.map((event: any) => (
              <div 
                key={event._id}
                className={getEventCardClass(event.bookingStatus)}
              >
                {/* Event Image */}
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

                  {/* Event Details */}
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
                      <i className="fas fa-tag w-4 text-blue-600 text-xs"></i>
                      <span className={`text-xs ml-2 font-medium ${getStatusColor(event.bookingStatus)}`}>
                        {event.bookingStatus === "booking" 
                          ? "Completed" 
                          : event.bookingStatus.charAt(0).toUpperCase() + event.bookingStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Conditionally render Rating Button */}
                  {event.bookingStatus === "booking" && event.isRated === false && (
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
            ))}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
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