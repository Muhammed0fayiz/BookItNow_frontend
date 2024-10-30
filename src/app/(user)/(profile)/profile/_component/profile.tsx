'use client'
import { axiosInstanceMultipart } from '@/shared/axiousintance';
import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/component/edituserprofile';
import ChangePasswordForm from '@/component/changepassword';

interface UserDetails {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    console.log('enter logout');
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  useEffect(() => {
    const cookieToken = getCookie('userToken');
    console.log('Token from cookies:', cookieToken);

    if (cookieToken) {
      fetchUserDetails(cookieToken);
    }
  }, []);

  const fetchUserDetails = async (token: string) => {
    try {
      
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;
      console.log('User ID from token:', userId);
      setUserId(userId);
      const response = await axiosInstanceMultipart.get(`/getUser/${userId}`);

    
     
      if (response.data) {
        setUserDetails(response.data.response);
        console.log('Fetched user data:', response.data.response);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length > 1) {
      return parts[1].split(';')[0];
    }

    return undefined;
  };

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangePasswordClick = () => {
    setIsChangePasswordModalOpen(true);
  };
  
  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
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
            {sidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Left Sidebar */}
        <aside className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-24`}>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
              <img
                src={userDetails?.profileImage || "http://i.pravatar.cc/250?img=58"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold">{userDetails?.username || 'Guest'}</h3>
              <span className="text-sm font-light">User</span>
            </div>
          </div>

          <ul className="space-y-6">
            <li>
              <a href="#upcoming" className="block text-lg hover:bg-blue-700 p-3 rounded">
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="#history" className="block text-lg hover:bg-blue-700 p-3 rounded">
                Event History
              </a>
            </li>
            <li>
              <a href="#wallet" className="block text-lg hover:bg-blue-700 p-3 rounded">
                Wallet
              </a>
            </li>
            <li>
              <a className="block text-lg hover:bg-blue-700 p-3 rounded cursor-pointer" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </aside>

        {/* Profile Section */}
        <div className={`flex-1 flex justify-center items-center ${sidebarOpen ? 'md:ml-64' : ''} p-6`}>
          <div className={`bg-white rounded-lg shadow-lg p-8 relative w-full max-w-md ${sidebarOpen ? 'md:opacity-100' : ''}`}>
            <div className="relative flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white shadow-lg absolute -top-16">
                <img
                  src={userDetails?.profileImage || "http://i.pravatar.cc/250?img=58"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
        
            <div className="text-center mt-16">
              <h4 className="text-2xl font-semibold">{userDetails?.username || 'Guest'}</h4>
              <span className="block text-sm font-light mt-1">{userDetails?.email || 'Guest'}</span>
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
                <i className="fas fa-wallet text-gold text-2xl"></i>
                <div className="text-3xl font-bold">47</div>
                <div className="text-sm">Wallet</div>
              </div>
              <div className="text-center">
                <i className="fas fa-calendar text-blue text-2xl"></i>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm">Upcoming Events</div>
              </div>
              <div className="text-center">
                <i className="fas fa-history text-pink text-2xl"></i>
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
          <div className="fixed inset-0 bg-black opacity-50" onClick={handleOverlayClick}></div>
          <div className="fixed inset-0 flex justify-center items-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <EditProfileForm 
                onClose={closeModal} 
                username={userDetails?.username || 'Guest'} 
                userID={userId || 'defaultUserID'}
              />
            </div>
          </div>
        </>
      )}

      {/* Modal for Change Password */}
      {isChangePasswordModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50" onClick={handleChangePasswordOverlayClick}></div>
          <div className="fixed inset-0 flex justify-center items-center z-50" onClick={handleChangePasswordOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <ChangePasswordForm 
                onClose={closeChangePasswordModal} 
                userId={userId || 'defaultUserID'}
              />
            </div>
          </div>
        </>
      )}

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Profile;