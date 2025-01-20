'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Plus, Edit2, Trash2, Phone, Star } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';

import usePerformerStore from '@/store/usePerformerStore';
import usePerformerEventsStore from '@/store/usePerformerEvents';
import axiosInstance from '@/shared/axiousintance';
import useChatNotifications from '@/store/useChatNotification';
import DescriptionViewer from '@/component/descriptionViewer';

interface Event {
  _id?: string;
  title: string;
  category: string;
  price: number;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
  isblocked: boolean;
  isperformerblockedevents: boolean;
}

const isValidEvent = (event: Partial<Event>): event is Event => {
  return !!(
    event.title &&
    event.category &&
    typeof event.price === 'number' &&
    event.teamLeader &&
    event.teamLeaderNumber &&
    typeof event.rating === 'number' &&
    event.description &&
    event.imageUrl
  );
};

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

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))}
    <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
  </div>
);

const EventManagementDashboard: React.FC = () => {
  const router = useRouter();
  const { events, fetchPerformerEvents, setEvents } = usePerformerEventsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
        fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
      }, [fetchNotifications]);
  useEffect(() => {
    console.log('Fetching data...');
    fetchPerformerDetails();
    fetchPerformerEvents();
  }, [fetchPerformerDetails, fetchPerformerEvents]);

  useEffect(() => {
    console.log('Fetched Events:', events);
  }, [events]);

  const handleBlockUnblock = async (id: string | undefined) => {
    if (!id) {
      console.error('ID is required');
      return;
    }

    try {
      const response = await axiosInstance.put(`/performerEvent/blockUnblockEvents/${id}`,{withCredentials:true});
      if (response.status === 200) {
        setEvents(events.map(event => {
          if (event._id === id) {
            return {
              ...event,
              isperformerblockedevents: !event.isperformerblockedevents
            };
          }
          return event;
        }));
      }
    } catch (error) {
      console.error('Error blocking/unblocking event:', error);
    }
  };

  const EventCard: React.FC<{
    event: Event;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }> = ({ event, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        {event.isblocked && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1">
            Admin Blocked Event
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <span className="text-lg font-bold text-blue-600">
            ₹{event.price.toLocaleString()}
          </span>
        </div>
 
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {event.category}
          </span>

          <div className="flex gap-2">
            {event.isblocked ? (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Admin Blocked
              </span>
            ) : (
              <button
                className={`px-2 py-1 rounded-full text-sm ${
                  event.isperformerblockedevents ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
                onClick={() => handleBlockUnblock(event._id)}
              >
                {event.isperformerblockedevents ? "Unblock" : "Block"}
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2"><DescriptionViewer description={event.description} maxLength={25} /></p>
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Team Leader:</span>
            <span>{event.teamLeader}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-gray-600" />
            <span>{event.teamLeaderNumber}</span>
          </div>
          <RatingStars rating={event.rating} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {event._id && !event.isblocked && (
            <>
              <button
                onClick={() => onEdit(event._id!)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-300"
                aria-label="Edit event"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(event._id!)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-300"
                aria-label="Delete event"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const validEvents = events.filter(isValidEvent);
  
  const filteredEvents = validEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    console.log('enter logout');
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  const handleCreateEvent = () => {
    router.replace('/event-management/eventupdate');
  };

  const handleEditEvent = (eventId: string) => {
    router.replace(`/event-management/eventupdate/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axiosInstance.delete(`/performer/deleteEvent/${eventId}`);
        if (response.status === 200) {
          const updatedEvents = events.filter(event => event._id !== eventId);
          setEvents(updatedEvents);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
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
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">Event Management</h1>
          <div className="flex items-center">
            <button 
              onClick={toggleChat} 
              className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300"
              aria-label="Toggle chat"
            >
              
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

        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <DashboardSection title="Quick Actions">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full lg:w-auto"
              >
                <Plus size={20} />
                Create New Event
              </button>
            

              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-lg p-2 pl-4"
                />
              </div>

              <div className="text-blue-600 font-medium">
                Total Events: <span className="font-bold">{validEvents.length}</span>
              </div>
            </div>
          </DashboardSection>

          <DashboardSection title="Event List">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No events found.</p>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default EventManagementDashboard;