'use client'
import React, { useEffect, useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import useAllEventsStore from '@/store/useAllEvents';
import usePerformersStore from '@/store/useAllPerformerStore';

interface Events {
  createdAt: string;
  id: number;
  _id?: string;
  title: string;
  category: string;
  userId: string;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
}

interface PerformerDetails {
  PId: string;
  userId: string;
  bandName: string;
  place: string;
  rating: number;
  description: string;
  image: string;
  genre: string;
  totalReviews: number;
  walletBalance: number;
  imageUrl?: string;
  mobileNumber: string;
}

const PerformerDetailsPage = () => {
    const router = useRouter();
  const params = useParams();
  const performerId = params.performerid as string;
  
  const { events, fetchAllEvents } = useAllEventsStore();
  const { performers, fetchAllPerformers } = usePerformersStore();
  const [activeTab, setActiveTab] = useState<'about' | 'events'>('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchAllEvents();
    fetchAllPerformers();
  }, [fetchAllEvents, fetchAllPerformers]);
  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const performer = performers.find(p => p.userId === performerId);
  const performerEvents = events.filter(event => 
    event.userId === performerId && event.status === 'active'
  );

  if (!performer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Performer not found.</p>
      </div>
    );
  }
  const profilePage: () => void = () => {
    router.replace('/profile');
  };
  return (
    <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center space-x-6">
            <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
              BookItNow
            </a>
          </div>

          {/* Menu Button for Small Devices */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

          {/* Full Navbar for Large Devices */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/home" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Events
             
            </a>
           

            <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About
            </a>
            <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                3
              </span>
            </a>
            <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sidebar for Small Devices */}
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
                <a href="/" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Home
                </a>
                <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Events
                </a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  About
                </a>
                <a href="/chat" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Chat
                </a>
                <a  className="text-gray-700 hover:text-blue-600 transition duration-300"onClick={profilePage}>
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            <img
              src={performer.profileImage|| '/default-profile.jpg'}
              alt={performer.bandName}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="mt-6 md:mt-0 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{performer.bandName}</h1>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < performer.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white">
                    {performer.rating.toFixed(1)} ({performer.totalReviews} reviews)
                  </span>
                </span>
              </div>
              <p className="text-lg mb-2">📍 {performer.place}</p>
              <p className="text-lg">📞 {performer.mobileNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button
              onClick={() => setActiveTab('about')}
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'about' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'events' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Events ({performerEvents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About {performer.bandName}</h2>
            <p className="text-gray-600 mb-6">{performer.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Performance Type</h3>
              
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                <p className="text-gray-600">
                  <strong>Mobile:</strong> {performer.mobileNumber}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {performer.place}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {performerEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
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
                      <span className="font-semibold">Price:</span> ₹{event.price}
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
                      <span className="font-semibold">Posted:</span>{' '}
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/events/${event.userId}/${event._id}`}
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
           

            {performerEvents.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600">No active events available from this performer.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformerDetailsPage;