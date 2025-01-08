'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';
import { useUpcomingEventsStore} from '@/store/useperformerupcomingevent';
import axiosInstance from '@/shared/axiousintance';
import { UpcomingEvent } from '@/types/store';
import useChatNotifications from '@/store/useChatNotification';

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

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

const UpcomingEvents: React.FC = () => {
  const { performerupcomingEvents, fetchAllEvents,totalCount } = useUpcomingEventsStore();
  const [cancelConfirmation, setCancelConfirmation] = useState<{ [key: string]: boolean }>({});
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const handleCancelEvent = async (eventId: string, eventDate: string) => {

    const eventDateTime = new Date(eventDate);
    const currentDate = new Date();
    const daysDifference = Math.ceil((eventDateTime.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

    if (daysDifference <= 6) {
      alert("You cannot cancel events less than 6 days before the event date.");
      return;
    }

    // If no confirmation shown for this event, show confirmation
    if (!cancelConfirmation[eventId]) {
      setCancelConfirmation(prev => ({...prev, [eventId]: true}));
      return;
    }

    try {
      const response = await axiosInstance.post(`/performer/cancelevent/${eventId}`,{withCredentials:true});
  
      if (response.status === 200) {
        console.log("Event canceled successfully:", response.data);
        
        // Refetch events to update the list
        fetchAllEvents();
        
        // Reset confirmation state
        setCancelConfirmation(prev => {
          const newState = {...prev};
          delete newState[eventId];
          return newState;
        });
      } else {
        console.log("Failed to cancel the event:", response.data);
      }
    } catch (error) {
      console.error("Error canceling the event:", error);
    }
  };

    useEffect(() => {
   
      const pages = Math.ceil(totalCount / 8); 
      setTotalPages(pages); 
    }, [totalCount]); 
  useEffect(() => {
    fetchPerformerDetails();
    fetchAllEvents();
   
  }, [fetchPerformerDetails, fetchAllEvents]);
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
        `/performer/performerUpcomingEvents/${performerDetails?.PId}?page=${page}`,
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
  
    useEffect(() => {
    if (performerupcomingEvents) {
      setEvents(performerupcomingEvents);
    }
  }, [performerupcomingEvents]);
  
  return (
    <DashboardSection title="Upcoming Events">
    {events.length === 0 ? (
      <p className="text-gray-500 text-center">No upcoming events</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div 
            key={event._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {event.imageUrl && (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Date:</strong>  {formatDate(event.date)}</p>
                <p><strong>Time:</strong>  {formatTime(event.time)}</p>
                <p><strong>Place:</strong> {event.place}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Status:</strong> {event.bookingStatus}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-green-600 font-medium">
                ₹{event.price}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
              {/* Conditionally render cancel button based on booking status */}
              {event.bookingStatus !== 'canceled' && (
                <div>
                  {cancelConfirmation[event._id] ? (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleCancelEvent(event._id, event.date)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setCancelConfirmation(prev => {
                          const newState = {...prev};
                          delete newState[event._id];
                          return newState;
                        })}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-200"
                      >
                        Keep Event
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCancelEvent(event._id, event.date)}
                      className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Cancel Event
                    </button>
                  )}
                </div>
              )}
              
            </div>
          </div>
          
        ))}
    
      </div>
      
     
    )}
         <div className="flex justify-center items-center space-x-2 mt-6">
   <button
      onClick={handlePreviousClick} // Using the handlePreviousClick function
      disabled={currentPage === 1 || isLoadingEvents} // Disable if it's the first page or loading
      className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
    >
      Previous
    </button>
            
          {[...Array(totalPages)].map((_, index) => (
  <button
    key={index + 1}
    onClick={() => paginationEvent(index + 1)} // Call paginationEvent with the page number
    disabled={isLoadingEvents}
    className={`px-4 py-2 rounded-md text-sm font-medium
      ${currentPage === index + 1
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } transition-colors duration-300`}
  >
    {index + 1}
  </button>
))}

              <button
      onClick={handleNextClick} // Using the handleNextClick function
      disabled={currentPage === totalPages || isLoadingEvents} // Disable if it's the last page or loading
      className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
    >
      Next
    </button>
          </div>
    
  </DashboardSection>
  );
};

const PerformerDashboard: React.FC = () => {
  
  const router = useRouter();
  const { performerupcomingEvents, fetchAllEvents,totalCount } = useUpcomingEventsStore();
  
  // UI Store
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  
  // Performer Store
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  
  // Chat Store
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();

  const {  totalUnreadMessage, notifications, fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
        fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
      }, [fetchNotifications]);
  
  useEffect(() => {
    fetchPerformerDetails();
    fetchAllEvents();
   
  }, [fetchPerformerDetails, fetchAllEvents]);


  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

 
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />
    

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
            <button onClick={toggleChat} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
            <a href="/chatsession" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              {totalUnreadMessage > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
    {totalUnreadMessage}
  </span>
)}
            </a>
            </button>
          </div>
        </nav>  

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          <UpcomingEvents />
        
        </main>

        {/* Chat Section */}
        <div className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 ${chatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-white">
              <Menu size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg: { id: React.Key | null | undefined; sender: string; text: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
              <div key={msg.id} className={`mb-2 ${msg.sender === 'performer' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'performer' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-l-lg p-2"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default PerformerDashboard;