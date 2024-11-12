'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAllEventsStore from '@/store/useAllEvents';
import usePerformersStore from '@/store/useAllPerformerStore';
import { Calendar, MapPin, Clock, Share2, MessageCircle } from 'lucide-react';

const EventDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventid as string;
  const performerId = params.performerid as string;

  const { events, fetchAllEvents } = useAllEventsStore();
  const { performers, fetchAllPerformers } = usePerformersStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    fetchAllEvents();
    fetchAllPerformers();
  }, [fetchAllEvents, fetchAllPerformers]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const event = events.find(e => e._id === eventId);
  const performer = performers.find(p => p.userId === performerId);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Add share functionality
    console.log('Share clicked');
  };

  const goToPerformerPage = () => {
    router.push(`/events/${performer?.userId}`);
 
    
  };

  if (!event || !performer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-600 text-lg">Event not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src={event.imageUrl}
                alt={event.title}
                className={`w-full h-full object-cover min-h-[500px] transition-transform duration-700 group-hover:scale-110 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleLike}
                  className={`p-3 ${isLiked ? 'bg-red-500' : 'bg-white/90'} backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${isLiked ? 'text-white' : 'text-gray-700'}`}
                    fill={isLiked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-2xl font-bold text-blue-600">₹{event.price}</p>
                  <p className="text-sm text-gray-600">per booking</p>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">{event.title}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 font-semibold text-gray-800">{event.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-600 font-semibold">{event.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">{new Date(event.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">{event.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Duration: 2 hours</span>
                  </div>
                </div>

                {/* Host Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h2 className="text-xl font-semibold mb-3">Host Information</h2>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {event.teamLeader.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{event.teamLeader}</p>
                      <p className="text-gray-600">{event.teamLeaderNumber}</p>
                    </div>
                    <button
                      onClick={goToPerformerPage}
                      className="ml-auto text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Book Now
                  </button>
                  {/* <button className="px-8 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Contact Host
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;