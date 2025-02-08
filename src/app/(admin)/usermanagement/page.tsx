'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/component/adminSidebar';
import { adminLogout, checkAdminSession, fetchPerformers, fetchUsers, updateStatus } from '@/services/admin';
import { toast } from 'sonner';

// Define detailed interfaces for API responses

interface User {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    isVerified: boolean;
}

interface Performer {
    _id: string;
    userId: string;
    bandName: string;
    mobileNumber: string;
    rating: number;
    isBlocked: boolean;
}

type Item = User | Performer;

// Type guard
function isUser(item: Item): item is User {
    return 'email' in item;
}

const UserPerformerManagement = () => {

   
 const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [performers, setPerformers] = useState<Performer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [view, setView] = useState<'users' | 'performers'>('users');
    const [currentPage, setCurrentPage] = useState(1);
    const [updating, setUpdating] = useState(false);
    const itemsPerPage = 4;
    const router = useRouter();
  useEffect(() => {
    const verifySession = async () => {
      const isAuthenticated = await checkAdminSession();
      if (!isAuthenticated) {
        router.replace('/adminlogin');
      }
    };
  
    verifySession();
  }, [router]);
  

  useEffect(() => {

      const fetchData = async () => {
        try {
          const [usersResponse, performersResponse] = await Promise.all([
            fetchUsers(),
            fetchPerformers(),
          ]);

          const validUsers: User[] = usersResponse.map(user => ({
            id: user._id,
            name: user.username || 'N/A',
            email: user.email || 'N/A',
            isBlocked: user.isblocked,
            isVerified: user.isVerified,
          }));
          setUsers(validUsers);

          const performersData: Performer[] = performersResponse.map(performer => ({
            _id: performer._id,
            userId: performer.userId.toString(),
            bandName: performer.bandName,
            mobileNumber: performer.mobileNumber,
            rating: performer.rating,
            isBlocked: performer.userId.isBlocked,
          }));
          setPerformers(performersData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    
  }, []);

   useEffect(() => {
      const verifySession = async () => {
        const isAuthenticated = await checkAdminSession();
        if (!isAuthenticated) {
          router.replace('/adminlogin');
        }
      };
    
      verifySession();
    }, [router]);
    
  const handleLogout = async () => {
    try {
      const response = await adminLogout(); 
      if (response.success) {
        toast.success('Logged out successfully');
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      } else {
        toast.error('Logout failed: ' + response.message);
      }
    } catch (error) {
      toast.error('Error during logout');
      console.error('Error during logout:', error);
    }
  };
  const handleStatusChange = async (item: Item) => {
    setUpdating(true);
    try {
      const newIsBlocked = !item.isBlocked;
      const isUserItem = isUser(item);
  
      await updateStatus(isUserItem ? item.id : item.userId, newIsBlocked, isUserItem);
  
      if (isUserItem) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === item.id ? { ...user, isBlocked: newIsBlocked } : user
          )
        );
      } else {
        setPerformers(prevPerformers =>
          prevPerformers.map(performer =>
            performer.userId === item.userId ? { ...performer, isBlocked: newIsBlocked } : performer
          )
        );
      }
  
      setConfirmationOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

    const openConfirmation = (item: Item) => {
        setSelectedItem(item);
        setConfirmationOpen(true);
    };

    const filteredData = view === 'users'
        ? users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : performers.filter(performer => 
            performer.bandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            performer.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase())
          );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );



    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, view]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      }, []);
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
         <Sidebar sidebarOpen={false} handleLogout={handleLogout} />
            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
                <div className="flex-1 p-8">
                    <div className="mt-0 bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">User and Performer Management</h2>
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                className={`text-lg px-4 py-2 rounded transition-colors duration-200 ${view === 'users' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                                onClick={() => {
                                    setSearchTerm(''); 
                                    setView('users');
                                }}
                            >
                                Users
                            </button>
                            <button
                                className={`text-lg px-4 py-2 rounded transition-colors duration-200 ${view === 'performers' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                                onClick={() => {
                                    setSearchTerm(''); 
                                    setView('performers');
                                }}
                            >
                                Performers
                            </button>
                        </div>

                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md pl-10"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-indigo-700 text-white">
                                        <th className="p-4">{view === 'users' ? 'Name' : 'Band Name'}</th>
                                        <th className="p-4">{view === 'users' ? 'Email' : 'Mobile Number'}</th>
                                        <th className="p-4">{view === 'users' ? 'Verified' : 'Rating'}</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item: Item) => (
                                            <tr key={isUser(item) ? item.id : item._id} className="border-b hover:bg-gray-100">
                                                <td className="p-4">{isUser(item) ? item.name : item.bandName}</td>
                                                <td className="p-4">{isUser(item) ? item.email : item.mobileNumber}</td>
                                                <td className="p-4">
                                                    {isUser(item) ? (item.isVerified ? 'Yes' : 'No') : item.rating}
                                                </td>
                                                <td className="p-4">{item.isBlocked ? 'Blocked' : 'Active'}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => openConfirmation(item)}
                                                        className={`px-4 py-2 rounded text-white ${item.isBlocked ? 'bg-green-500' : 'bg-red-500'}`}
                                                    >
                                                        {item.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center">No results found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-gray-300'}`}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-gray-300'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Transition show={confirmationOpen} as={React.Fragment}>
                <Dialog onClose={() => setConfirmationOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white rounded-lg p-6 w-96">
                            <Dialog.Title className="text-lg font-bold mb-4">
                                {updating ? 'Updating...' : 
                                selectedItem && 
                                `Are you sure you want to ${selectedItem.isBlocked ? 'unblock' : 'block'} ${isUser(selectedItem) ? selectedItem.name : selectedItem.bandName}?`}
                            </Dialog.Title>
                            <div className="flex justify-between">
                                <button
                                    className="px-4 py-2 text-white bg-red-500 rounded"
                                    onClick={() => selectedItem && handleStatusChange(selectedItem)}
                                    disabled={updating || !selectedItem}
                                >
                                    Yes
                                </button>
                                <button
                                    className="px-4 py-2 text-gray-500 bg-gray-200 rounded"
                                    onClick={() => setConfirmationOpen(false)}
                                >
                                    No
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default UserPerformerManagement;