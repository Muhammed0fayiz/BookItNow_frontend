'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/shared/axiousintance';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('handle logout')
      // Make the logout request to the backend
      const response = await axiosInstance.post('/admin/adminLogout');
  console.log('response',response)
      if (response.data.success) {
        // Wait for a brief delay, then redirect to the login page
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      } else {
        // Handle case where the logout failed, for example by showing an alert
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error during logout:', error);
    }
  };
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get('/admin/checkSession');
        if (!response.data.isAuthenticated) {
          router.replace('/adminlogin');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };
  
    checkSession();
  }, [router]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div className="text-blue-600 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30`}>
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
            <img
              src="http://i.pravatar.cc/250?img=58"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Admin Name</h3>
            <span className="text-sm font-light">Administrator</span>
          </div>
        </div>

        <nav>
          <ul className="space-y-4">
            {[
              { icon: faHome, text: 'Dashboard', href: '/dashboard' },
              { icon: faUsers, text: 'User Management', href: '/usermanagement' },
              { icon: faUsers, text: 'Events', href: '/eventmanagement' },
              { icon: faLock, text: 'Verification', href: '/verification' },
              { icon: faWallet, text: 'Wallet', href: '#wallet' }
            ].map((item, index) => (
              <li key={index}>
                <a href={item.href} className="flex items-center text-lg hover:bg-blue-700 p-3 rounded-lg transition-colors duration-200">
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {item.text}
                </a>
              </li>
            ))}
            {/* Logout item now triggers handleLogout */}
            <li>
              <button onClick={handleLogout} className="w-full text-left flex items-center text-lg hover:bg-blue-700 p-3 rounded-lg transition-colors duration-200">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            dashboard
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
