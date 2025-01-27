'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faInbox } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/shared/axiousintance';
import Sidebar from '@/component/adminSidebar';

type AdminRevenue = {
  userName: string;
  performerName: string;
  eventName: string;
  status: string;
  place: string;
  date: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'booking': return 'bg-yellow-100 text-yellow-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RevenuePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [revenueData, setRevenueData] = useState<AdminRevenue[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get('/admin/checkSession');
        if (response.data.isAuthenticated) {
          setSessionValid(true);
        } else {
          router.replace('/adminlogin');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.replace('/adminlogin');
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (sessionValid) {
      fetchRevenueData();
    }
  }, [sessionValid, currentPage]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/getRevenue', {
        params: { page: currentPage }
      });

      const { adminRevinue, totalCount, totalPages } = response.data;
      
      setRevenueData(adminRevinue);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
      if (response.data.success) {
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const EmptyState: React.FC = () => (
    <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <FontAwesomeIcon icon={faInbox} className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-2xl font-medium text-gray-900">No revenue data available</h3>
      <p className="mt-1 text-sm text-gray-500">Revenue entries will appear here.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div className="text-blue-600 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading Revenue Data...</h2>
        </div>
      </div>
    );
  }

  if (!sessionValid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} handleLogout={handleLogout} />

      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-600">
            <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Revenue</h2>
            
            {revenueData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="p-4 font-semibold">User Name</th>
                      <th className="p-4 font-semibold">Performer Name</th>
                      <th className="p-4 font-semibold">Event Name</th>
                      <th className="p-4 font-semibold">Status</th>
                   
                      <th className="p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors duration-200`}
                      >
                        <td className="p-4 font-medium text-gray-800">{entry.userName}</td>
                        <td className="p-4 font-medium text-gray-800">{entry.performerName}</td>
                        <td className="p-4 font-medium text-gray-800">{entry.eventName}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                   
                        <td className="p-4 text-gray-700">{formatDate(entry.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {revenueData.length > 0 && (
              <div className="flex justify-between items-center mt-6 bg-gray-100 p-4 rounded-lg">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1} 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages} 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;