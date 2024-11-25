'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/shared/axiousintance';
import useAdminDetails from '@/store/useAdminDetails';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { adminDetails, isLoading, error, fetchAdminDetails } = useAdminDetails();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
      if (response.data.success) {
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);
  
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

  // Prepare data for charts with modified wallet transactions
  const userRegistrationData = adminDetails ? Object.entries(adminDetails.userRegistrationHistory).map(([date, count]) => ({
    date,
    count
  })) : [];

  const performerRegistrationData = adminDetails ? Object.entries(adminDetails.performerRegistrationHistory).map(([date, count]) => ({
    date,
    count
  })) : [];

  // Multiply wallet transaction amounts by 10
  const walletTransactionData = adminDetails ? Object.entries(adminDetails.walletTransactionHistory).map(([date, amount]) => ({
    date,
    amount: amount * 10  // Multiplying amount by 10
  })) : [];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
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
            <li>
              <button onClick={handleLogout} className="w-full text-left flex items-center text-lg hover:bg-blue-700 p-3 rounded-lg transition-colors duration-200">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        <main className="p-6">
          {adminDetails ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Wallet Balance Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FontAwesomeIcon icon={faWallet} className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                      <h3 className="text-2xl font-bold">₹{adminDetails.walletAmount}</h3>
                    </div>
                  </div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold">{adminDetails.totalUsers}</h3>
                    </div>
                  </div>
                </div>

                {/* Total Performers Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Performers</p>
                      <h3 className="text-2xl font-bold">{adminDetails.totalPerformers}</h3>
                    </div>
                  </div>
                </div>

                {/* Latest Transaction Card - Now multiplied by 10 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FontAwesomeIcon icon={faWallet} className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Latest Transaction</p>
                      <h3 className="text-2xl font-bold">
                        ₹{(walletTransactionData[walletTransactionData.length - 1]?.amount || 0)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Registration Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">User Registration Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userRegistrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performer Registration Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Performer Registration Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performerRegistrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Wallet Transaction Chart - Now showing multiplied amounts */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Wallet Transaction History</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={walletTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#0891b2" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-center text-gray-500">No admin details available.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;