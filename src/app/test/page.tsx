'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, UserCircle, Calendar, Clock, LogOut, MessageCircle, Wallet } from 'lucide-react';
import { axiosInstanceMultipart } from '@/shared/axiousintance';
import EditProfileForm from '@/component/edituserprofile';
import ChangePasswordForm from '@/component/changepassword';

interface UserDetails {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const cookieToken = getCookie('userToken');
    if (cookieToken) {
      fetchUserDetails(cookieToken);
    }
  }, []);

  const fetchUserDetails = async (token: string) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;
      setUserId(userId);
      const response = await axiosInstanceMultipart.get(`/getUser/${userId}`);
      if (response.data) {
        setUserDetails(response.data.response);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length > 1) return parts[1].split(';')[0];
    return undefined;
  };

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    router.push('/auth');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={`bg-blue-600 text-white w-full md:w-64 fixed md:static top-0 left-0 h-full md:h-screen transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-30`}>
        <div className="p-6">
          {/* User Avatar and Name */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
              <img
                src={userDetails?.profileImage || "/api/placeholder/48/48"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold">{userDetails?.username || 'Guest'}</h3>
              <span className="text-sm font-light">User</span>
            </div>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-4">
            <li>
              <a href="#profile" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <UserCircle className="mr-2" size={20} /> Profile
              </a>
            </li>
            <li>
              <a href="#upcoming" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <Calendar className="mr-2" size={20} /> Upcoming Events
              </a>
            </li>
            <li>
              <a href="#history" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <Clock className="mr-2" size={20} /> Event History
              </a>
            </li>
            <li>
              <a href="#wallet" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <Wallet className="mr-2" size={20} /> Wallet
              </a>
            </li>
            <li>
              <a className="flex items-center text-lg hover:bg-blue-700 p-3 rounded cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2" size={20} /> Logout
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md flex justify-between items-center px-6 py-4 z-20">
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          </div>
          <a href="/chat" className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
            <MessageCircle size={24} />
          </a>
        </nav>

        {/* User Profile Content */}
        <div className="flex-1 p-6 mt-4 md:mt-0">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto relative">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 mb-4">
                <img
                  src={userDetails?.profileImage || "/api/placeholder/128/128"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-2xl font-semibold">{userDetails?.username || 'Guest'}</h4>
              <span className="text-sm text-gray-600 mt-1">{userDetails?.email || 'guest@example.com'}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                Change Password
              </button>
            </div>

            {/* Profile Stats */}
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <div className="text-center">
                <Wallet className="mx-auto text-blue-600" size={32} />
                <div className="text-3xl font-bold mt-2">47</div>
                <div className="text-sm text-gray-600">Wallet</div>
              </div>
              <div className="text-center">
                <Calendar className="mx-auto text-green-600" size={32} />
                <div className="text-3xl font-bold mt-2">5</div>
                <div className="text-sm text-gray-600">Upcoming Events</div>
              </div>
              <div className="text-center">
                <Clock className="mx-auto text-purple-600" size={32} />
                <div className="text-3xl font-bold mt-2">12</div>
                <div className="text-sm text-gray-600">Event History</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <EditProfileForm 
              onClose={() => setIsModalOpen(false)} 
              username={userDetails?.username || 'Guest'} 
              userID={userId || 'defaultUserID'}
            />
          </div>
        </div>
      )}

      {/* Modal for Change Password */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <ChangePasswordForm 
              onClose={() => setIsChangePasswordModalOpen(false)} 
              userId={userId || 'defaultUserID'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;