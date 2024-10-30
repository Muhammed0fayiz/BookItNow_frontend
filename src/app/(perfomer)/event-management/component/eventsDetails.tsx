'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send, Plus, Edit2, Trash2, Calendar, Star, Phone, Search } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import useEventManagerStore from '@/store/useEventManagerStore';
import usePerformerStore from '@/store/usePerformerStore';

interface Event {
  id: number;
  title: string;
  category: string;
  price: number;

  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
}

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

const EventManagementDashboard: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Summer Concert',
      category: 'Music',
      price: 1500,
   

      status: 'Upcoming',
      teamLeader: 'John Doe',
      teamLeaderNumber: '+1 234-567-8900',
      rating: 4.5,
      description: 'A fantastic summer evening concert featuring local artists and international stars.',
      imageUrl: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Music Festival',
      category: 'Festival',
      price: 2500,
 
   
      status: 'Planning',
      teamLeader: 'Jane Smith',
      teamLeaderNumber: '+1 234-567-8901',
      rating: 4.8,
      description: 'Three-day music festival with multiple stages and various genres.',
      imageUrl: '/api/placeholder/400/250'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();
  const { eventManagerDetails, fetchEventManagerDetails } = useEventManagerStore();
  const { performerDetails, stats, fetchPerformerDetails, handleLogout: storeHandleLogout } = usePerformerStore();
  useEffect(() => {
    fetchEventManagerDetails();
  }, [fetchEventManagerDetails]);
  React.useEffect(() => {
    fetchPerformerDetails();
  }, [fetchPerformerDetails]);
  
  const sidebarDetails = eventManagerDetails ? {
    bandName: eventManagerDetails.name || '',
    imageUrl: '',
  } : null;

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    router.push('/auth');
  };

  const handleCreateEvent = () => {
   router.replace('/eventupdate')
  };

  const handleEditEvent = (eventId: number) => {
    console.log('Edit event:', eventId);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const renderRatingStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
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
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">Event Management</h1>
          <div className="flex items-center">
            <button onClick={toggleChat} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
              <MessageCircle size={24} />
            </button>
          </div>
        </nav>

        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          {/* Search and Total Events Display */}
        

          <DashboardSection title="Quick Actions">
  <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
    {/* Create Event Button */}
    <button
      onClick={handleCreateEvent}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-4 lg:mb-0" // Add margin-bottom for small screens
    >
      <Plus size={20} />
      Create New Event
    </button>

    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search events..."
      className="border rounded-lg p-2 flex-grow mx-4 mb-4 lg:mb-0" // Add margin for spacing on small screens
      onChange={(e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Add filtering logic here if you want to filter the displayed events
        setEvents((prevEvents) =>
          prevEvents.filter((event) =>
            event.title.toLowerCase().includes(searchTerm)
          )
        );
      }}
    />

    {/* Total Events Display */}
    <div className="text-red-600 mb-4 lg:mb-0"> {/* Add margin-bottom for small screens */}
      Total Events: <span className="font-bold">{events.length}</span>
    </div>
  </div>
</DashboardSection>




          <DashboardSection title="Current Events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <span className="text-lg font-bold text-blue-600">${event.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        event.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Team Leader:</span>
                        <span>{event.teamLeader}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={16} className="text-gray-600" />
                        <span>{event.teamLeaderNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderRatingStars(event.rating)}
                        <span className="ml-2 text-gray-600">({event.rating})</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidebar} />
      )}
      <div className={`${chatOpen ? 'block' : 'hidden'} fixed right-0 bottom-0 md:w-1/3 h-2/5 bg-white rounded-t-lg shadow-lg flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between bg-blue-600 text-white p-4">
          <h2 className="font-semibold">Chat</h2>
          <button onClick={toggleChat} className="p-2 rounded-full hover:bg-blue-700 transition duration-300">
            <Send size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
  {messages.map((message, index) => (
    <div key={index} className="p-2 bg-gray-100 rounded-lg">
      {typeof message === 'string' ? message : message.content}
    </div>
  ))}
</div>

        <div className="flex items-center p-4 border-t">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventManagementDashboard;
