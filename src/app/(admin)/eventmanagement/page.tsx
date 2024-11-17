'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/shared/axiousintance';
import useAllEventsAdminStore from '@/store/useAllEventsAdmin';

const EventManagement = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { events, fetchAllEvents } = useAllEventsAdminStore();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
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

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);
  const blockunblock = async (_id: string | undefined) => {
    if (!_id) {
      console.error('Event ID is undefined. Cannot block/unblock event.');
      return;
    }
  
    try {
      console.log('Event ID:', _id);
      
      // Make the API call with the event ID
      const response = await axiosInstance.post(`/admin/blockUnblockEvents/${_id}`);
  if(response.status==200){
 
    fetchAllEvents();
  }
      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error('Error blocking/unblocking event:', error);
    }
  };
  
  
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
              { icon: faUsers, text: 'Events', href: '/eventmanagement' },
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
            {/* Logout item now triggers handleLogout */}
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
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        </header>

        <main className="p-6">
        
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b">Title</th>
                  <th className="py-3 px-4 border-b">Category</th>
                 
                  <th className="py-3 px-4 border-b">Price</th>
                  <th className="py-3 px-4 border-b">Status</th>
                  <th className="py-3 px-4 border-b">Team Leader</th>
                  <th className="py-3 px-4 border-b">Contact</th>
                  <th className="py-3 px-4 border-b">Image</th>
                  <th className="py-3 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
  {events.map((event) => (
    <tr key={event._id} className="border-b text-center">
      <td className="py-3 px-4">{event.title}</td>
      <td className="py-3 px-4">{event.category}</td>
      <td className="py-3 px-4">{event.price}</td>
      <td
  className={`py-3 px-4 ${
    event.isblocked ? "text-red-500" : "text-green-500"
  }`}
>
  {event.isblocked ? "Inactive" : "Active"}
</td>

      <td className="py-3 px-4">{event.teamLeader}</td>
      <td className="py-3 px-4">{event.teamLeaderNumber}</td>
      <td className="py-3 px-4">
        <img src={event.imageUrl} alt={event.title} className="w-12 h-12 object-cover mx-auto" />
      </td>
      <td className="py-3 px-4">
      <button 
  onClick={() => blockunblock(event._id)}
  className={`py-2 px-4 rounded font-semibold ${
    event.isblocked
      ? "bg-green-500 text-white hover:bg-green-600"
      : "bg-red-500 text-white hover:bg-red-600"
  }`}
>
  {event.isblocked ? "Unblock" : "Block"}
</button>

      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventManagement;
