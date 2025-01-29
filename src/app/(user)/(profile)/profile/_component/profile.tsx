'use client'
import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, Menu, X, Wallet } from 'lucide-react';
import EditProfileForm from '@/component/edituserprofile';
import ChangePasswordForm from '@/component/changepassword';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { loginImage } from '@/datas/logindatas';
import Sidebar from '@/component/userSidebar';
import useChatNotifications from '@/store/useChatNotification';
import { useUpcomingEventsStore } from '@/store/useUserUpcomingEvents';
import { useUserEventHistory } from '@/store/useUserEventHistory';

const Profile = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { totalCount: upcomingEventsTotalCount, fetchAllEvents: fetchUpcomingEvents } = useUpcomingEventsStore();
  const { totalCount: userEventHistoryTotalCount, fetchAllEvents: fetchUserEventHistory } = useUserEventHistory();
  const { userProfile, isLoading, error, fetchUserProfile, handleLogout } = useUserStore();
  const { totalUnreadMessage, fetchNotifications } = useChatNotifications();

  // Reset modal states on mount and handle initial data fetching
  useEffect(() => {
    setIsModalOpen(false);
    setIsChangePasswordModalOpen(false);
    
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchNotifications(),
          fetchUserProfile(),
          fetchUpcomingEvents(),
          fetchUserEventHistory()
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
      }
    };

    initializeData();

    // Clean up function to reset states when component unmounts
    return () => {
      setIsModalOpen(false);
      setIsChangePasswordModalOpen(false);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setIsChangePasswordModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await fetchUserProfile();
  };

  const handlePasswordModalClose = async () => {
    setIsChangePasswordModalOpen(false);
    await fetchUserProfile();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <span className="text-red-500 text-6xl mb-4">⚠️</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchUserProfile()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <a href="/home" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 ml-2">BookItNow</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/chat" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <MessageCircle size={24} />
                {totalUnreadMessage > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadMessage}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex pt-16">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          handleLogout={handleLogout}
        />

        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              
              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Profile Image */}
                <div className="absolute -top-16 left-6">
                  <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src={userProfile?.profileImage || loginImage.img}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = loginImage.img;
                      }}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{userProfile?.username || 'Guest'}</h1>
                      <p className="text-gray-600">{userProfile?.email || 'guest@example.com'}</p>
                    </div>
                    <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                        <Wallet className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">₹{userProfile?.walletBalance?.toFixed(2) || '0.00'}</h3>
                      <p className="text-gray-600">Wallet Balance</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                        <Bell className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{upcomingEventsTotalCount}</h3>
                      <p className="text-gray-600">Upcoming Events</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{userEventHistoryTotalCount}</h3>
                      <p className="text-gray-600">Event History</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => handleModalClose()}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <EditProfileForm 
              onClose={handleModalClose} 
              username={userProfile?.username || ''} 
              userID={userProfile?.id || ''}
            />
          </div>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => handlePasswordModalClose()}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <ChangePasswordForm 
              onClose={handlePasswordModalClose} 
              userId={userProfile?.id || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;