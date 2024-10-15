'use client';
import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faArrowUp, faArrowDown, faSignOutAlt, faUsers, faLock, faHome } from '@fortawesome/free-solid-svg-icons';

const Wallet = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading overlay if loading is true
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-10">
        <a href="">
          <h1 className="text-2xl font-bold text-blue-600">BookitNow</h1>
        </a>
        <div className="flex space-x-4 items-center">
          <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
            {sidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Left Sidebar */}
        <aside className={`w-64 bg-blue-600 text-white p-6 fixed top-16 left-0 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-20`}>
          {/* Admin Avatar and Name */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
              <img
                src="http://i.pravatar.cc/250?img=58"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold">Admin Name</h3>
              <span className="text-sm font-light">Administrator</span>
            </div>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-6">
          <li>
              <a href="#" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <FontAwesomeIcon icon={faHome} className="mr-3" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="/usermanagement" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <FontAwesomeIcon icon={faUsers} className="mr-3" />
                User Management
              </a>
            </li>
            <li>
              <a href="/permissions" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <FontAwesomeIcon icon={faLock} className="mr-3" />
                Verification

              </a>
            </li>
            <li>
              <a href="#wallet" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <FontAwesomeIcon icon={faWallet} className="mr-3" />
                Wallet
              </a>
            </li>
            <li>
              <a href="/logout" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                Logout
              </a>
            </li>
          </ul>
        </aside>

        {/* Wallet Content Section */}
        <div className={`flex-1 flex justify-center items-center ${sidebarOpen ? 'blur-sm' : ''}`}>
          <div className={`bg-white rounded-lg shadow-lg p-8 relative w-full max-w-md ${sidebarOpen ? 'opacity-30' : ''}`}>
            {/* Wallet Dashboard Content */}
            <h2 className="text-2xl font-semibold text-center">Your Wallet</h2>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Balance: $100.00</h3>
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Transaction History</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Deposit</span>
                    <span className="text-green-600">+$50.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Withdrawal</span>
                    <span className="text-red-600">-$20.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Deposit</span>
                    <span className="text-green-600">+$70.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Wallet;
