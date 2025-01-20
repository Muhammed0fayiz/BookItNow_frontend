'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import { useFavoritesStore } from '@/store/useFavoriteEvents';
import axiosInstance from '@/shared/axiousintance';
import '@fortawesome/fontawesome-free/css/all.min.css';
import RatingModal from '@/component/rating';
import { loginImage } from '@/datas/logindatas';
import useChatNotifications from '@/store/useChatNotification';
import InitialLoading from '@/component/loading';
import DescriptionViewer from '@/component/descriptionViewer';
const EventHistory: React.FC = () => {
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const { favoriteEvents, fetchfavoriteEvents } = useFavoritesStore();
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
      const loadInitialData = async () => {
        setIsInitialLoading(true);
        try {
          await Promise.all([
            fetchUserProfile(),
        
            fetchNotifications()
          ]);
        } catch (error) {
          console.error('Error loading initial data:', error);
        } finally {
          setIsInitialLoading(false);
        }
      };
      
      loadInitialData();
    }, [fetchUserProfile, fetchNotifications]);
    useEffect(() => {
      fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
    }, [fetchNotifications]);
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchfavoriteEvents();
    console.log('upcoming', favoriteEvents);
  }, [fetchfavoriteEvents]);

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

  const handleBookEvent = (eventId: string) => {
   


  };

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      const response = await axiosInstance.post(`/userEvent/toggleFavoriteEvent/${userProfile?.id}/${eventId}`);
      
      if (response.status === 200) {
      
        useFavoritesStore.setState(prevState => ({
          favoriteEvents: prevState.favoriteEvents.filter(event => event._id !== eventId)
        }));
      }
    } catch (error) {
      console.error('Error removing favorite event:', error);
    
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

  const getEventCardClass = (status: string) => {
    const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 relative';
    return status === 'cancelled' 
      ? `${baseClasses} opacity-90` 
      : baseClasses;
  };

  if (isInitialLoading) {
    return <InitialLoading />;
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
        <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              {totalUnreadMessage > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
    {totalUnreadMessage}
  </span>
)}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 ml-[250px]"> Favorite Events</h2>
       

          <div className="grid grid-cols-1 ml-[250px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteEvents && favoriteEvents.map((event: any) => (
              <div 
                key={event._id}
                className={getEventCardClass(event.bookingStatus)}
              >
                {/* Event Image */}
                <div className="relative h-32">
                  <img
                    src={event.imageUrl || '/event-placeholder.jpg'}
                    alt={event.title}
                    className={`w-full h-full object-cover ${event.bookingStatus === 'cancelled' ? 'filter grayscale' : ''}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/event-placeholder.jpg';
                    }}
                  />
             
                </div>

                <div className={`p-4 ${event.bookingStatus === 'cancelled' ? 'opacity-75' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  <DescriptionViewer description={event.description} maxLength={20} />
                  </p>

                  {/* Event Details */}
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Team leader: </span>{event.teamLeader}
                  </p>
                  <p className="text                  .text-gray-700 text-sm">
                    <span className="font-semibold">Number: </span>{event.teamLeaderNumber}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Status: </span>{event.status}
                  </p>
          
                  <div>

</div>

<div className="mt-4 flex justify-between items-center">
  {event.isblocked || event.isperformerblockedevents ? (
    <p className="text-red-600 text-sm font-semibold">
      Cannot book 
    </p>
  ) : (
    <button
      onClick={() => router.push(`/events/${event.userId}/${event._id}`)}
      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
    >
      Book Now
    </button>
  )}
  <button
    onClick={() => handleRemoveFavorite(event._id)}
    className=   "  text-red-600 text-sm hover:underline"
  >
    Remove
  </button>
</div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHistory;

