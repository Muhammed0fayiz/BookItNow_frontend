'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useWalletHistoryStore from '@/store/useWalletHistory';
import { loginImage } from '@/datas/logindatas';
import useChatNotifications from '@/store/useChatNotification';
import InitialLoading from '@/component/loading';
import Sidebar from '@/component/userSidebar';
interface Transaction {
  _id: string;
  date: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  description: string;
  performer?: string;
  status: 'completed' | 'pending' | 'failed';
}

const UserWallet: React.FC = () => {
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  useChatNotifications();
    useEffect(() => {
      const loadInitialData = async () => {
        setIsInitialLoading(true);
        try {
          await Promise.all([
            fetchUserProfile(),

            fetchNotifications()
          ]);
        } catch (error) {
          console.error('Error loading initial data:', error);
        } finally {
          setIsInitialLoading(false);
        }
      };
      
      loadInitialData();
    }, [fetchUserProfile,  fetchNotifications]);
  useEffect(() => {
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);
  useEffect(() => {
    fetchWalletHistory();
  }, [fetchWalletHistory]);

  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleProfileClick = () => {
    router.push('/profile');
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isInitialLoading) {
    return <InitialLoading />;
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
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 h-16">
        <a href="/home">
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
        </a>
        <div className="flex space-x-4 items-center">
       
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
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
  sidebarOpen={sidebarOpen}
  toggleSidebar={toggleSidebar}
  handleLogout={handleLogout}
/>

        {/* Wallet Content */}
        <div className="flex-1 md:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Wallet Balance Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Wallet Balance</h2>
                  <p className="text-4xl font-bold text-blue-600 mt-2">₹{userProfile?.walletBalance?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="text-right">
                  {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                    Add Money
                  </button> */}
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
              </div>
              <div className="overflow-x-auto">
                {walletHistory.length > 0 ? (
                  <table className="w-full">
                   <thead className="bg-blue-100">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
  </tr>
</thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {walletHistory.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.transactionType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={transaction.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.transactionType === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </span>
                          </td>
                       
                         
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default UserWallet;