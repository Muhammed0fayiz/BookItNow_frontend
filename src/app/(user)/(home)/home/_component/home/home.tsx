'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { banner1, djparty, motivationspeaker, music } from '@/datas/homepagedatas';
import UploadEventForm from '@/component/perfomerform';
import useUserStore from '@/store/useUserStore';

import useChatNotifications from '@/store/useChatNotification';
import axiosInstance from '@/shared/axiousintance';


const Home = () => {
  const router = useRouter()
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  useChatNotifications();
  useEffect(() => {
   
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);
  // const { userDetails, loading, error } = useAuth();
  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

 
  
  const { 
    userProfile, 
    isLoading, 
    error, 
    fetchUserProfile, 
   
  } = useUserStore();
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  const handlefetch=async()=>{
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }
  const events = [
    { title: "Comedy Night", date: "October 12, 2024", location: "New York City", image: music.img },
    { title: "Music Fest", date: "November 5, 2024", location: "Los Angeles", image: djparty.img },
    { title: "Theater Show", date: "December 20, 2024", location: "San Francisco", image: motivationspeaker.img },
  ];
  // {userDetails?.id}
  const profilePage: () => void = () => {
    router.replace('/profile');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
       <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
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
            <a href="/" className="text-blue-600 font-semibold transition duration-300">
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
              {totalUnreadMessage > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
    {totalUnreadMessage}
  </span>
)}

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


      <main>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
          <h1 className="text-5xl font-bold mb-4 animate__animated animate__fadeInDown">Welcome to BookItNow</h1>
        
          <p className="mt-4 text-xl animate__animated animate__fadeInUp animate__delay-1s">Find and book your favorite events, shows, and more!</p>
          <a
            href="#events"
            className="mt-8 inline-block bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 animate__animated animate__fadeInUp animate__delay-2s"
          >
            Explore Events
          
          </a>
        </header>

        <section id="events" className="py-16 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 animate__animated animate__fadeIn">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <div key={index} className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl animate__animated animate__fadeIn animate__delay-3s">
                <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">Date: {event.date} | Location: {event.location}</p>
                  <a href="/book" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                    Book Now
                  </a>
                </div> 
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 animate__animated animate__fadeIn">What Our Users Say</h2>
          <div className="max-w-4xl mx-auto px-6">
            <blockquote className="text-2xl italic text-center animate__animated animate__fadeIn animate__delay-1s">
              "Booking an event has never been this easy! Highly recommend BookItNow."
            </blockquote>
            <cite className="block text-right mt-4 text-lg animate__animated animate__fadeIn animate__delay-2s">- Fayiz</cite>
          </div>
        </section>

      
        <img src={banner1.img} alt="" className="w-full max-h-100 object-cover" />
    




        <section className="py-16 bg-white">
          <h3 className="text-3xl font-bold text-center mb-6 text-blue-600 animate__animated animate__fadeInUp">
            Would you like to upload your own program or event?
          </h3>
          <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto px-6 animate__animated animate__fadeInUp animate__delay-1s">
            As the gateway to your events, BookItNow empowers your creativity with seamless, end-to-end solutions.
          </p>
          <div className="text-center">
    {userProfile?.isVerified ? (
      <div className="text-green-600 font-semibold animate__animated animate__fadeInUp animate__delay-2s">
        You are a verified performer. Please visit your performer dashboard to manage events.
      </div>
    ) : userProfile?.waitingPermission ? (
      <div className="text-yellow-600 font-semibold animate__animated animate__fadeInUp animate__delay-2s">
        You are waiting for permission to become a performer.
      </div>
    ) : (
      <button
        onClick={toggleFormVisibility}
        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 animate__animated animate__fadeInUp animate__delay-2s"
      >
        Let's bring your event to life
      </button>
    )}
  </div>
</section>


        {isFormVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={toggleFormVisibility}
              >
                &times;
              </button>
           <UploadEventForm id={userProfile?.id} onClose={toggleFormVisibility} handlefetch={handlefetch}/>


            </div>
          </div>
        )}
      </main>
 
      


      
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  );
};


export default Home;
