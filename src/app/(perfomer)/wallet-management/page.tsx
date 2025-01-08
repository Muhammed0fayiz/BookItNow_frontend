'use client'
import React, { ReactElement, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send, ArrowUpRight, ArrowDownRight, Wallet, Clock, Filter } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';
import useWalletHistoryStore from '@/store/useWalletHistory';
import useUserStore from '@/store/useUserStore';
import useChatNotifications from '@/store/useChatNotification';
interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const PerformerWallet: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();
  const {  totalUnreadMessage, notifications, fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
        fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
      }, [fetchNotifications]);
  useEffect(() => {
    fetchPerformerDetails();
    fetchWalletHistory();
  }, [fetchPerformerDetails, fetchWalletHistory]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
            <button onClick={toggleChat} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
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

        {/* Wallet Content */}
        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {/* Wallet Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Main Balance Card */}
              <div className="col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center mb-4">
                  <Wallet className="w-8 h-8 mr-3" />
                  <h2 className="text-lg font-medium opacity-90">Total Balance</h2>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-bold mb-2">₹{userProfile?.walletBalance?.toFixed(2) || '0.00'}</p>
                    <p className="text-blue-100">Available for withdrawal</p>
                  </div>
                  {/* <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition duration-300">
                    Withdraw Funds
                  </button> */}
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-gray-600 font-medium mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowUpRight className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Total Credits</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      +₹{walletHistory
                        .filter(t => t.transactionType === 'credit')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowDownRight className="w-5 h-5 text-red-600 mr-3" />
                      <span className="text-gray-700">Total Debits</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      -₹{walletHistory
                        .filter(t => t.transactionType === 'debit')
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                  </div>
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-300">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {walletHistory.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {walletHistory.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50 transition duration-300">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-800">{transaction.description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${transaction.transactionType === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'}`}>
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {transaction.role}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <span className={transaction.transactionType === 'credit' 
                              ? 'text-green-600' 
                              : 'text-red-600'}>
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

        {/* Chat Section */}
        <div className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 ${chatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-white">
              <Menu size={20} />
            </button>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-l-lg p-2"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default PerformerWallet;