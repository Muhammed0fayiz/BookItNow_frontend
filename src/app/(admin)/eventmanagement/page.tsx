'use client';
import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import useAllEventsAdminStore from '@/store/useAllEventsAdmin';
import Image from "next/image";
import Sidebar from '@/component/adminSidebar';
import BlockEventModal from '@/component/adminEventBlock';
import Description from '@/component/description';
import { adminLogout, blockEvent, checkAdminSession, unblockEvent } from '@/services/admin';
import { toast } from 'sonner';


const EventManagement = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const eventsPerPage = 10;
  
  const router = useRouter();
  const { events, fetchAllEvents } = useAllEventsAdminStore();

  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockConfirmOpen, setIsUnblockConfirmOpen] = useState(false);
  
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Block Event Handler
  const handleBlockEvent = async (duration: string, reason: string) => {
    if (!selectedEvent) {
      console.error('No event selected for blocking');
      return;
    }
  
    try {
      await blockEvent(selectedEvent, duration, reason);
      fetchAllEvents();
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error('Failed to block event:', error);
    }
  };
  // Unblock Event Handler
  const handleUnblockEvent = async () => {
    if (!selectedEvent) {
      console.error('No event selected for unblocking');
      return;
    }
  
    try {
      await unblockEvent(selectedEvent);
      fetchAllEvents();
      setIsUnblockConfirmOpen(false);
    } catch (error) {
      console.error('Failed to unblock event:', error);
    }
  };
  // Block/Unblock Event Selector
  const blockUnblockEvent = async (_id?: string) => {
    if (!_id) {
      console.error('Event ID is undefined. Cannot block/unblock event.');
      return;
    }
  
    const eventToBlock = events.find(event => event._id === _id);
    
    if (eventToBlock?.isblocked) {
      // If event is blocked, show unblock confirmation
      setSelectedEvent(_id);
      setIsUnblockConfirmOpen(true);
    } else {
      // If event is not blocked, show block modal
      setSelectedEvent(_id);
      setIsBlockModalOpen(true);
    }
  };

  // Filter events based on debounced search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    event.teamLeader.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Calculate pagination values
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Page Change Handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Sidebar Toggle
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Logout Handler
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

  // Session Check Effect

  useEffect(() => {
    const verifySession = async () => {
      const isAuthenticated = await checkAdminSession();
      if (!isAuthenticated) {
        router.replace('/adminlogin');
      }
    };
  
    verifySession();
  }, [router]);
  // Loading Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Events Effect
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // Reset Page on Debounced Search
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Loading Spinner
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
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} handleLogout={handleLogout} />

      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        </header>

        <main className="p-6">
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No events found matching your search.
              </div>
            ) : (
              <>
                <table className="min-w-full bg-white shadow rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b">Title</th>
                      <th className="py-3 px-4 border-b">Details</th>
                      <th className="py-3 px-4 border-b">Price</th>
                      <th className="py-3 px-4 border-b">Image</th>
                      <th className="py-3 px-4 border-b">Status</th>
                      <th className="py-3 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map((event) => (
                      <tr key={event._id} className="border-b text-center">
                        <td className="py-3 px-4">{event.title}</td>
                        <td className="py-3 px-4">
                          <Description 
                            description={event.description} 
                            teamLeader={event.teamLeader}
                            teamLeaderNumber={event.teamLeaderNumber}
                            category={event.category}
                            maxLength={0} 
                          />
                        </td>
                        <td className="py-3 px-4">{event.price}</td>
                        <td className="py-3 px-4">
                        <Image
  src={event.imageUrl}
  alt={event.title}
  width={48} 
  height={48} 
  className="object-cover mx-auto"
/>
                        </td>
                        <td className={`py-3 px-4 ${event.isblocked ? "text-red-500" : "text-green-500"}`}>
                          {event.isblocked ? "Inactive" : "Active"}
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => blockUnblockEvent(event._id)}
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

                {/* Pagination Controls */}
                {filteredEvents.length > 0 && (
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Block Event Modal */}
        <BlockEventModal 
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          onBlock={handleBlockEvent}
          showTimeInput={true}
        />

        {/* Unblock Confirmation Modal */}
        {isUnblockConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Unblock</h2>
              <p className="mb-4">Are you sure you want to unblock this event?</p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsUnblockConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUnblockEvent}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;