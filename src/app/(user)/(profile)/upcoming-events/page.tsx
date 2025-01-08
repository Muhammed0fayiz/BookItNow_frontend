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
import { Calendar } from 'lucide-react';
import useChatNotifications from '@/store/useChatNotification';
import InitialLoading from '@/component/loading';

const UpcomingEvents: React.FC = () => {

  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { upcomingEvents, fetchAllEvents,totalCount } = useUpcomingEventsStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
const [events, setEvents] = useState<UpcomingEvent[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState<number>(0);
const [isInitialLoading, setIsInitialLoading] = useState(true);
const [isLoadingEvents, setIsLoadingEvents] = useState(false);
const {  totalUnreadMessage, notifications, fetchNotifications } =
useChatNotifications();
  useEffect(() => {
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchAllEvents(),
          fetchNotifications()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, [fetchUserProfile, fetchAllEvents, fetchNotifications]);
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);
  useEffect(() => {
    if (upcomingEvents) {
      setEvents(upcomingEvents);
    }
  }, [upcomingEvents]);
  useEffect(() => {
    fetchAllEvents();
    
  }, [fetchAllEvents]);
  useEffect(() => {
    console.log('upcoming', upcomingEvents);
    const pages = Math.ceil(totalCount / 9); 
    setTotalPages(pages); 
  }, [upcomingEvents, totalCount]); 
  
  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };
  const handlePreviousClick = () => {
    const newPage = Math.max(1, currentPage - 1);
    paginationEvent(newPage); // Fetch events for the new page
  };
  
  const handleNextClick = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    paginationEvent(newPage); // Fetch events for the new page
  };
  
  const paginationEvent = async (page: number) => {
    try {
      console.log('Fetching events for page:', page);
      setIsLoadingEvents(true);
      const response = await axiosInstance.get(
        `/userUpcomingEvents/${userProfile?.id}?page=${page}`,
        { withCredentials: true }
      );
  
      const events: UpcomingEvent[] = response.data.events.map((event: any) => ({
        ...event,
        date: new Date(event.date).toISOString(),
        createdAt: new Date(event.createdAt).toISOString(),
        updatedAt: new Date(event.updatedAt).toISOString(),
      }));
  
      setEvents(events);
      setCurrentPage(page); // Update the current page state
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
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
      const response = await axiosInstance.post(
        `/cancelevent/${selectedEvent._id}`,
        { withCredentials: true }
      );
      
     
      console.log('Cancellation response:', response.data);
     
    } catch (error) {
      console.error('Error cancelling event:', error);
      alert('Failed to cancel event. Please try again.');
    } finally {
      setCancellingEventId(null); 
      setIsModalOpen(false);      
      setSelectedEvent(null);    
      paginationEvent(currentPage); 
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
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Top Navbar */}
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 h-16">
        <a href="/home" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BookItNow
          </h1>
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
          <button className="md:hidden text-blue-600 p-2" onClick={toggleSidebar}>
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* ... existing sidebar code ... */}
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
        {/* Enhanced Events Section */}
        <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : ''} p-6 mt-2`}>
          {/* Page Header */}
          <div className="mb-8 ml-64">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
            </div>
            <p className="text-gray-600 ml-11">
              {totalCount > 0 
                ? `Showing ${events.length} of ${totalCount} upcoming events`
                : 'No upcoming events found'}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 ml-[250px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events && events.length > 0 ? (
              events.map((event: UpcomingEvent) => (
                // ... existing event card code with enhanced styling ...
                <div 
                  key={event._id}
                  className={`${getEventCardClass(event.bookingStatus)} hover:shadow-xl transition-all duration-300`}
                >
                  {/* ... rest of your event card content ... */}
                    {/* Cancelled Overlay */}
                {event.bookingStatus === 'cancelled' && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-30 z-10 flex flex-col items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-md transform -rotate-12 shadow-lg">
                      <span className="text-lg font-bold">CANCELLED</span>
                    </div>
                  </div>
                )}
 
                <div className="relative h-32">
                {/* <button onClick={paginationEvent}>fayiz mannani</button> */}
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
              ))
            ) : (
              // No Events State
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-blue-50 rounded-full p-6 mb-4">
                  <Calendar className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Upcoming Events</h3>
                <p className="text-gray-600 text-center mb-6">
                  You don't have any upcoming events scheduled. Browse our events page to find something interesting!
                </p>
                <a 
                  href="/home" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                >
                  <i className="fas fa-search"></i>
                  <span>Browse Events</span>
                </a>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
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
                  onClick={() => paginationEvent(index + 1)}
                  disabled={isLoadingEvents}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300
                    ${currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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