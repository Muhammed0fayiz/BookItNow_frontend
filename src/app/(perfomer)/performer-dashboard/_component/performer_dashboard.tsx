'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';
import useWalletHistoryStore from '@/store/useWalletHistory';
import axiosInstance from '@/shared/axiousintance';
import usePerformerAllDetails from '@/store/usePerformerAllDetails';
import { toast, ToastContainer } from 'react-toastify';
import useChatNotifications from '@/store/useChatNotification';
import 'react-toastify/dist/ReactToastify.css';
import { 
  PerformanceOverviewCard, 
  EventHistoryChart, 
  WalletTransactionChart, 
  UpcomingEventsPieChart 
} from '@/component/DashboardCharts';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  
  // Store hooks
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const { performerAllDetails, fetchPerformerAllDetails } = usePerformerAllDetails();
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
        fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
      }, [fetchNotifications]);
  // Fetch data on component mount
  useEffect(() => {
    const userId = usePerformerAllDetails.getState().getUserIdFromToken();
    if (userId) {
      fetchPerformerAllDetails(userId);
      fetchPerformerDetails();
      fetchWalletHistory();
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
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
 

      const response = await axiosInstance.get(`/performer/downloadReport/${performerDetails?.PId}`, {
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
      link.setAttribute('download', `performer_report_${startDate}_to_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-20">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          </div>
          <div className="flex items-center">
            <button 
              onClick={toggleChat} 
              className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300"
            >
                 <a href="/chatsession" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              {totalUnreadMessage > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
    {totalUnreadMessage}
  </span>
)}
            </a>
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          {/* Performance Overview */}
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
          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Performance Overview</h2>
            <PerformanceOverviewCard />
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-2">
              <EventHistoryChart />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <UpcomingEventsPieChart />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <WalletTransactionChart />
            </div>
          </section>

          {/* Band Details */}
          <section className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Band Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Band Name</h3>
                <p>{performerDetails?.bandName || 'Loading...'}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Location</h3>
                <p>{performerDetails?.place || 'Loading...'}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Rating</h3>
           
                <p>{(performerDetails?.rating ? performerDetails.rating.toFixed(1) : 'N/A')} / 5</p>

              </div>
            </div>
          </section>
        </div>

      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
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

export default PerformerDashboard;