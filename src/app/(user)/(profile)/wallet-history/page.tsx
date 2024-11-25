'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useWalletHistoryStore from '@/store/useWalletHistory';

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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <a href="/chat" className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
            <i className="fas fa-comments"></i>
          </a>
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
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
              <a href="/upcoming-events" className="block text-lg hover:bg-blue-700 p-3 rounded transition duration-300">
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="#history" className="block text-lg hover:bg-blue-700 p-3 rounded transition duration-300">
                Event History
              </a>
            </li>
            <li>
              <a href="/user-wallet" className="block text-lg bg-blue-700 p-3 rounded transition duration-300">
                Wallet
              </a>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full text-left block text-lg hover:bg-blue-700 p-3 rounded transition duration-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

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