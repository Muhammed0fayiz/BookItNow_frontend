'use client'
import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditProfileForm from '@/component/edituserprofile';
import ChangePasswordForm from '@/component/changepassword';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

const Profile: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  // Get values and actions from Zustand store
  const { 
    userProfile, 
    isLoading, 
    error, 
    fetchUserProfile, 
    handleLogout 
  } = useUserStore();

  // Fetch user profile on mount and after any updates
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  // Set up an interval to periodically refresh the profile data
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchUserProfile();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [fetchUserProfile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    // Refresh user profile after modal closes
    await fetchUserProfile();
  };

  const handleChangePasswordClick = () => {
    setIsChangePasswordModalOpen(true);
  };
  
  const closeChangePasswordModal = async () => {
    setIsChangePasswordModalOpen(false);
    // Refresh user profile after password change
    await fetchUserProfile();
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleChangePasswordOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeChangePasswordModal();
    }
  };

  // Handle logout with proper cleanup
  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogouts = () => {
    console.log('enter logout');
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50">
        <a href="/home">
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
        </a>
        <div className="flex space-x-4 items-center">
          <a href="/chat" className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
            <i className="fas fa-comments"></i>
          </a>
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Left Sidebar */}
        <aside 
          className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 z-40 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-24`}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
            <img
      src={userProfile?.profileImage || "/default-avatar.png"}
      alt="User Avatar"
      className="w-full h-full object-cover"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/default-avatar.png";
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

        {/* Profile Section */}
        <div className={`flex-1 flex justify-center items-start ${sidebarOpen ? 'md:ml-64' : ''} p-6`}>
          <div className={`bg-white rounded-lg shadow-lg p-8 relative w-full max-w-md ${sidebarOpen ? 'md:opacity-100' : ''}`}>
            <div className="relative flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white shadow-lg absolute -top-16">
                <img
                  src={userProfile?.profileImage || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-avatar.png";
                  }}
                />
              </div>
            </div>
        
            <div className="text-center mt-16">
              <h4 className="text-2xl font-semibold">{userProfile?.username || 'Guest'}</h4>
              <span className="block text-sm font-light mt-1">{userProfile?.email || 'guest@example.com'}</span>
              <button
                onClick={handleEditProfileClick}
                className="block w-full mt-6 border border-black rounded-full py-2 px-6 text-sm transition hover:bg-black hover:text-white"
              >
                Edit Profile
              </button>
              <button
                onClick={handleChangePasswordClick}
                className="block w-full mt-3 border border-black rounded-full py-2 px-6 text-sm transition hover:bg-black hover:text-white"
              >
                Change Password
              </button>
            </div>

            {/* Profile Stats */}
            <div className="flex justify-between mt-8">
              <div className="text-center">
                <i className="fas fa-wallet text-yellow-500 text-2xl"></i>
                <div className="text-3xl font-bold">{userProfile?.walletBalance?.toFixed(2) || '0.00'}</div>
                <div className="text-sm">Wallet</div>
              </div>
              <div className="text-center">
                <i className="fas fa-calendar text-blue-500 text-2xl"></i>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm">Upcoming Events</div>
              </div>
              <div className="text-center">
                <i className="fas fa-history text-pink-500 text-2xl"></i>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm">Event History</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Edit Profile */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleOverlayClick}></div>
          <div className="fixed inset-0 flex justify-center items-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <EditProfileForm 
                onClose={closeModal} 
                username={userProfile?.username || ''} 
                userID={userProfile?.id || ''}
              />
            </div>
          </div>
        </>
      )}

      {/* Modal for Change Password */}
      {isChangePasswordModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleChangePasswordOverlayClick}></div>
          <div className="fixed inset-0 flex justify-center items-center z-50" onClick={handleChangePasswordOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <ChangePasswordForm 
                onClose={closeChangePasswordModal} 
                userId={userProfile?.id || ''}
              />
            </div>
          </div>
        </>
      )}

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Profile;