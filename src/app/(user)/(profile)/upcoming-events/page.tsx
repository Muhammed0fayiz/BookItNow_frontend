'use client'

import React, { useState, useEffect } from 'react';
import { useUpcomingEventsStore } from '@/store/useUserUpcomingEvents';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { UpcomingEvent } from '@/types/store'; // Import the interface we created earlier

interface UserProfile {
  username?: string;
  profileImage?: string;
}

const UpcomingEvents: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { upcomingEvents, fetchAllEvents } = useUpcomingEventsStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleLogouts = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        {/* Sidebar content remains the same */}
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
              />
            </div>
            <div>
              <h3 className="text-md font-semibold">{userProfile?.username || 'Guest'}</h3>
              <span className="text-sm font-light">User</span>
            </div>
          </div>

          <ul className="space-y-6">
            <li>
              <a href="/upcoming-events" className="block text-lg hover:bg-blue-700 p-3 rounded transition duration-300">
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="#history" className="block text-lg hover:bg-blue-700 p-3 rounded transition duration-300">
                Event History
              </a>
            </li>
            <li>
              <a href="#wallet" className="block text-lg hover:bg-blue-700 p-3 rounded transition duration-300">
                Wallet
              </a>
            </li>
            <li>
              <button 
                onClick={handleLogouts}
                className="w-full text-left block text-lg hover:bg-blue-700 p-3 rounded transition duration-300"
              >
                Logout
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
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="relative h-32">
                  <img
                    src={event.imageUrl || "/event-placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/event-placeholder.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
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
                      <p className="text-base font-bold text-blue-600">
                        ₹{event.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-600 mb-1">Booking Status</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {event.bookingStatus}
                      </span>
                    </div>
                  </div>
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
    </div>
  );
};

export default UpcomingEvents;