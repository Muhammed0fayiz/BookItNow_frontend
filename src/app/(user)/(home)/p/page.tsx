'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import useChatNotifications from '@/store/useChatNotification';
import axiosInstance from '@/shared/axiousintance';
import { useFavoritesStore } from '@/store/useFavoriteEvents';
import usePerformersStore from '@/store/useAllPerformerStore';

interface Event {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  rating: number;
  teamLeader: string;
  teamLeaderNumber: string;
  createdAt: string;
  userId: string;
  status: string;
}

interface Performer {
  userId: string;
  bandName: string;
  description: string;
  profileImage: string;
  place: string;
  rating: number;
}

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
  const { userProfile, fetchUserProfile } = useUserStore();
  const { favoriteEvents, fetchfavoriteEvents } = useFavoritesStore();
  const { totalUnreadMessage, fetchNotifications } = useChatNotifications();
  const { performers, fetchAllPerformers } = usePerformersStore();

  // State for filtered events
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch events with filters
  const fetchFilteredEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/getFilteredEvents', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          order: sortOrder,
          page: currentPage,
          search: searchQuery || undefined,
        },
      });
  
      if (response.data) {
        // Always update state with the latest response, even if empty
        setEvents(response.data.events || []);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Clear the events if no data
        setEvents([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Error fetching events');
      // Clear events on error
      setEvents([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Single useEffect for events fetching
  useEffect(() => {
    fetchFilteredEvents();
  }, [selectedCategory, sortOrder, currentPage, searchQuery]);

  // Single useEffect for initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchNotifications(),
          fetchfavoriteEvents(),
          fetchAllPerformers()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Reset handlers
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to first page on sort change
  };
  // Filter performers based on search
  const filteredPerformers = performers.filter(performer => 
    performer.bandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Effect to fetch events when filters change
  useEffect(() => {
    fetchFilteredEvents();
    console.log('eveddfan',events)
  }, [currentPage, selectedCategory, sortOrder, searchQuery]);

  // Initial data fetching
  useEffect(() => {
    fetchUserProfile();
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
    fetchfavoriteEvents();
    fetchAllPerformers();
  }, [fetchUserProfile, fetchNotifications, fetchfavoriteEvents, fetchAllPerformers]);

  const handleWishlist = async (id: string | undefined) => {
    try {
      await axiosInstance.post(`/toggleFavoriteEvent/${userProfile?.id}/${id}`);
      fetchfavoriteEvents();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {/* ... (keep existing navigation JSX) ... */}

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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Events Section */}
          {activeTab === 'events' && (
            <>
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
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

              {/* Sorting and Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 mb-4 sm:mb-0"
                >
                  <span>Sort by Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
                </button>

                <div className="flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
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
               
                  {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 relative">
                       <button 
                        onClick={() => handleWishlist(event._id)} 
                        className="absolute top-4 right-4 z-10 focus:outline-none"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-7 w-7 ${
                            favoriteEvents.includes(event._id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-300 hover:text-red-300'
                          }`}
                          fill="none" 
                          viewBox="0 0 2424" stroke="currentColor">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                          />
                        </svg>
                      </button>

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
              {!isLoading && !error && events.length === 0 && (
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
                  {/* Performer card content */}
                  {/* ... (keep existing performer card JSX) ... */}
                </div>
              ))}

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
        <h1>he;{totalCount}</h1>
   
      
      </footer>
    </div>
  );
};

export default EventsPage;