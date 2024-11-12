'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAllEventsStore from '@/store/useAllEvents';
import usePerformersStore from '@/store/useAllPerformerStore';

const categories = [
  { id: 'all', name: 'All Events' },
  { id: 'music', name: 'Music' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'speaker', name: 'Speakers' },
  { id: 'sports', name: 'Sports' }
];

const EventsPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('events');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { events, isLoading, error, fetchAllEvents } = useAllEventsStore();
  const { performers, fetchAllPerformers } = usePerformersStore();

  useEffect(() => {
    fetchAllEvents();
    fetchAllPerformers();
  }, [fetchAllEvents, fetchAllPerformers]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Filter events based on category and search query
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = event.status === 'active';
    return matchesCategory && matchesSearch && isActive;
  });

  // Filter performers based on band name
  const filteredPerformers = performers.filter(performer => 
    performer.bandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
              BookItNow
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="/home" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </a>
            <a href="/events" className="text-blue-600 font-semibold transition duration-300">
              Events
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About
            </a>
            <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
            </a>
            <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={toggleMenu}
              >
                &times;
              </button>
              <div className="flex flex-col p-6">
                <a href="/home" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Home
                </a>
                <a href="/events" className="text-blue-600 font-semibold transition duration-300 mb-4">
                  Events
                </a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  About
                </a>
                <a href="/chat" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Chat
                </a>
                <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
     

        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">
              {activeTab === 'events' ? 'Discover Amazing Events' : 'Find Talented Performers'}
            </h1>
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                placeholder={activeTab === 'events' 
                  ? "Search events by name or description..." 
                  : "Search performers by band name..."}
                className="w-full px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>
           {/* Tab Navigation */}
           <div className="bg-white shadow-sm">
  <div className="container mx-auto px-4">
    <div className="flex justify-center space-x-8 py-4">
      <button
        onClick={() => setActiveTab('events')}
        className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
          activeTab === 'events' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Events
      </button>
      <button
        onClick={() => setActiveTab('performers')}
        className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
          activeTab === 'performers' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Performers
      </button>
    </div>
  </div>
</div>

        <div className="container mx-auto px-4 py-8">
          {/* Show category filters only for events */}
          {activeTab === 'events' && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full transition duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Events Section */}
          {activeTab === 'events' && (
            <>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-gray-600">{event.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <span className="font-semibold">Price:</span> {event.price}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Category:</span> {event.category}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Team Leader:</span> {event.teamLeader}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Contact:</span> {event.teamLeaderNumber}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Posted:</span> {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => router.push(`/events/${event.userId}/${event._id}`)}
                          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Events Results Message */}
              {!isLoading && !error && filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No events found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {/* Performers Section */}
          {activeTab === 'performers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPerformers.map((performer) => (
                <div key={performer.userId} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <img
                    src={performer.profileImage || '/default-profile.jpg'}
                    alt={performer.bandName}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold">{performer.bandName}</h3>
                  <p className="text-gray-600">{performer.description}</p>
                  <p className="text-gray-600"><strong>Location:</strong> {performer.place}</p>
                  <p className="text-gray-600"><strong>Rating:</strong> {performer.rating} / 5</p>
                  <button
                    onClick={() => router.push(`/events/${performer.userId}`)}
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    View Profile
                  </button>
                </div>
              ))}

              {/* No Performers Results Message */}
              {filteredPerformers.length === 0 && (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-600">No performers found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8 mt-16">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EventsPage;