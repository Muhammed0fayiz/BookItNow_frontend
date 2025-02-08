"use client";

import React, { useState, useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useWalletHistoryStore from "@/store/useWalletHistory";
import useChatNotifications from "@/store/useChatNotification";
import InitialLoading from "@/component/loading";
import Sidebar from "@/component/userSidebar";
import Navbar from "@/component/userNavbar";

const UserWallet: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userProfile, error, fetchUserProfile, handleLogout } = useUserStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();
  const { fetchNotifications } = useChatNotifications();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchWalletHistory(),
          fetchNotifications(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [fetchUserProfile, fetchWalletHistory, fetchNotifications]);

  useEffect(() => {
    fetchNotifications().catch((err) =>
      console.error("Error fetching notifications:", err)
    );
  }, [fetchNotifications]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle="My Wallet"
        />

        {/* Main Content */}
        <div className="pt-16 p-6">
          {/* Wallet Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Wallet Balance
                </h2>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  ₹{userProfile?.walletBalance?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Transaction History
              </h2>
            </div>
            <div className="overflow-x-auto">
              {walletHistory.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
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
                          <span
                            className={
                              transaction.transactionType === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {transaction.transactionType === "credit"
                              ? "+"
                              : "-"}
                            ₹{transaction.amount.toLocaleString()}
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
  );
};

export default UserWallet;
