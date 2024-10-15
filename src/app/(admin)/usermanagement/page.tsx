'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/shared/axiousintance';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    isVerified?: boolean;
}

interface Performer {
    _id: string;
    userId: string;
    bandName: string;
    place: string;
    rating: number;
    isBlocked: boolean;
}

type Item = User | Performer;

function isUser(item: Item): item is User {
    return 'email' in item;
}

const UserPerformerManagement = () => {
    const [loading, setLoading] = useState(true);
    const [sessionValid, setSessionValid] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        const checkSession = async () => {
            try {
                const response = await axiosInstance.get('/checkSession');
                if (response.data.isAuthenticated) {
                    setSessionValid(true);
                } else {
                    router.replace('/adminlogin');
                }
            } catch (error) {
                console.error('Session check failed:', error);
                router.replace('/adminlogin');
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    useEffect(() => {
        if (sessionValid) {
            const fetchData = async () => {
                try {
                    const [usersResponse, performersResponse] = await Promise.all([
                        axiosInstance.get('/getUsers'),
                        axiosInstance.get('/performers')
                    ]);

                    if (Array.isArray(usersResponse.data)) {
                        const validUsers = usersResponse.data.map((user: any): User => ({
                            id: user._id || '',
                            name: user.username || 'N/A',
                            email: user.email || 'N/A',
                            isBlocked: user.isblocked || false,
                            isVerified: user.isVerified || false
                        }));
                        setUsers(validUsers);
                    }

                    if (performersResponse.data.success && Array.isArray(performersResponse.data.data)) {
                        const performersData = performersResponse.data.data.map((performer: any): Performer => ({
                            _id: performer._id,
                            userId: performer.userId.toString(),
                            bandName: performer.bandName,
                            place: performer.place,
                            rating: performer.rating,
                            isBlocked: performer.userId.isBlocked,
                        }));
                        setPerformers(performersData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [sessionValid]);

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/adminLogout');
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

    const handleStatusChange = async (item: Item) => {
        setUpdating(true);
        try {
            const newIsBlocked = !item.isBlocked;
            const endpoint = isUser(item) ? `/updateUserStatus/${item.id}` : `/updatePerformerStatus/${item.userId}`;
            const payload = { isBlocked: newIsBlocked };

            await axiosInstance.post(endpoint, payload);

            if (isUser(item)) {
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

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
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
            performer.place.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (!sessionValid) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
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
                                        <th className="p-4">{view === 'users' ? 'Email' : 'Place'}</th>
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
                                                <td className="p-4">{isUser(item) ? item.email : item.place}</td>
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
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-300 rounded"
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