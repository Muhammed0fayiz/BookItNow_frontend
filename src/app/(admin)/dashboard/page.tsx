'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faBars, faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/shared/axiousintance';
import useAdminDetails from '@/store/useAdminDetails';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/component/adminSidebar';


const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const { adminDetails, isLoading, error, fetchAdminDetails } = useAdminDetails();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
      if (response.data.success) {
        toast.success('Logged out successfully');
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      } else {
        toast.error('Logout failed: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error during logout');
      console.error('Error during logout:', error);
    }
  };

  const handleDownloadReport = async () => {
  if (!startDate || !endDate) {
       toast.error('Please select both start and end dates');
       return;
     }
   
     const today = new Date();
     const selectedStartDate = new Date(startDate);
     const selectedEndDate = new Date(endDate);
   
   
     if (selectedStartDate > today) {
       toast.error('Start date cannot be in the future');
       return;
     }
   
     if (selectedStartDate > selectedEndDate) {
       toast.error('Start date cannot be after end date');
       return;
     }

    try {
      const response = await axiosInstance.get('/admin/downloadReport', {
        params: { 
          startDate, 
          endDate 
        },
        responseType: 'blob'
      });
      

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin_report_${startDate}_to_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
      console.error('Error downloading report:', error);
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
    
         <Sidebar sidebarOpen={sidebarOpen} handleLogout={handleLogout} />


      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        <main className="p-6">
          {/* Report Download Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
            <div className="flex space-x-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
              <button 
                onClick={handleDownloadReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 mt-6"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Rest of the dashboard content */}
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

      {/* Toast Notification Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminDashboard;