'use client'
import React, {useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu,Plus, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isAfter } from 'date-fns';
import useChatNotifications from '@/store/useChatNotification';
// Sidebar Component
import Sidebar from '@/component/performersidebar';

// Store Hooks
import { useUIStore } from '@/store/useUIStore';
import usePerformerStore from '@/store/usePerformerStore';
import { useSlotStore } from '@/store/useslotDetails';
import { addSlot, removeSlot } from '@/services/performer';

// Type Definitions
interface Slot {
  id: string;
  date: Date;
  isBooked: boolean;
}


const SlotManagement: React.FC = () => {
  // State Management
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slotss, setSlots] = useState<Slot[]>([]);
  const { slots, fetchSlotDetails} = useSlotStore();

  // Hooks
  const router = useRouter();
  const { sidebarOpen,toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const {  totalUnreadMessage,fetchNotifications } =
  
  useChatNotifications();
    useEffect(() => {
        fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
      }, [fetchNotifications]);
  // Memoized Calendar Days Calculation
  const calendarDays = useMemo(() => {
    const yearDays: { month: number; days: Date[] }[] = [];
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(currentYear, month, 1);
      const lastDayOfMonth = new Date(currentYear, month + 1, 0);
      const days = eachDayOfInterval({ 
        start: startOfMonth(firstDayOfMonth), 
        end: endOfMonth(lastDayOfMonth) 
      });
      yearDays.push({ month, days });
    }
    return yearDays;
  }, [currentYear]);

  // Updated Slot Management Handlers
  const handleAddSlot = async (date: Date) => {
    if (!performerDetails?.userId) {
      alert('User ID is missing');
      return;
    }
  
    if (isAfter(new Date(), date)) {
      alert("Cannot add slots for past dates");
      return;
    }
  
    try {
      const response = await addSlot(performerDetails.userId, date);
  
      if (response.status === 403) {
        alert(response.message || "Slot already exists or cannot be added");
        return;
      }
  
      if (response.success) {
        setSlots(prevSlots => [
          ...prevSlots, 
          { id: `slot-${Date.now()}`, date, isBooked: false }
        ]);
      } else {
        alert(response.message || "Failed to add slot");
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert('This day is already booked for an event or there was an error.');
    } finally {
      fetchSlotDetails('performerId');
    }
  };
  
  
  const handleRemoveSlot = async (slotId: string) => {
    if (!performerDetails?.userId) {
      console.error("Performer ID is missing");
      return;
    }
  
    try {
      const response = await removeSlot(slotId, performerDetails.userId);
  
      if (response.message === "Slot removed successfully") {
        console.log("Slot removed");
        // You can update the UI here if needed
      }
    } catch (error) {
      console.error("Failed to remove slot:", error);
    }
  };
  

  // Authentication Handler
  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  // Side Effects
  useEffect(() => {
    fetchPerformerDetails();

  }, [fetchPerformerDetails]);

  useEffect(() => {
    fetchSlotDetails('performerId');
  }, [fetchSlotDetails]);
  // Render Calendar Grid
  const renderCalendarGrid = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
          onClick={() => setCurrentYear(currentYear - 1)}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-2xl font-bold">{currentYear} Slot Management</h2>
        <button 
          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
          onClick={() => setCurrentYear(currentYear + 1)}
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Calendar Months Grid */}
      <div className="grid grid-cols-3 gap-4">
        {calendarDays.map(({ month, days }) => (
          <div key={month} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              {format(new Date(currentYear, month), 'MMMM')}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Weekday Headers */}
              {['S', 'M', 'Tu', 'W', 'T', 'F', 'Sa'].map(day => (
                <div key={day} className="text-xs font-bold text-gray-500">{day}</div>
              ))}
              
              {/* Calendar Days */}
              {days.map(date => {
                // Check if date is in bookingDates or unavailableDates
                const isBookedDate = slots?.bookingDates?.some(
                  bookDate => new Date(bookDate).toDateString() === date.toDateString()
                );
                const isUnavailableDate = slots?.unavailableDates?.some(
                  unavailDate => new Date(unavailDate).toDateString() === date.toDateString()
                );

                return (
                  <div 
                    key={date.toISOString()} 
                    className={`
                      relative p-1 
                      ${!isSameMonth(date, new Date(currentYear, month)) ? 'text-gray-300' : ''}
                      ${isToday(date) ? 'bg-blue-100 rounded-full' : ''}
                      ${isBookedDate ? 'bg-green-200' : ''}
                      ${isUnavailableDate ? 'bg-red-200' : ''}
                    `}
                  >
                    <span className="text-xs">
                      {date.getDate()}
                    </span>
                    {isSameMonth(date, new Date(currentYear, month)) && (
                      <button 
                        onClick={() => setSelectedDate(date)}
                        className="absolute inset-0 hover:bg-blue-50 rounded-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Slot Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Slots for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
              >
                <Menu size={20} />
              </button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium"> Update Slots</h4>
              <button 
                className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
                onClick={() => handleAddSlot(selectedDate)}
              >
                <Plus size={20} />
              </button>
            </div>

            {slotss
              .filter(slot => slot.date.toDateString() === selectedDate.toDateString())
              .map(slot => (
                <div 
                  key={slot.id} 
                  className="flex justify-between items-center p-2 border rounded-lg mb-2"
                >
                  <div>
                    Slot for {format(slot.date, 'MMMM d, yyyy')}
                    {slot.isBooked && <span className="text-red-500 ml-2">(Booked)</span>}
                  </div>
                  <button 
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                    onClick={() => handleRemoveSlot(slot.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            
            {/* {slotss.filter(slot => slot.date.toDateString() === selectedDate.toDateString()).length === 0 && (
              <p className="text-gray-500 text-center">No slots for this date</p>
            )} */}
          </div>
        </div>
      )}
    </div>
  );



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

        {/* Render Calendar Grid */}
        <div className="pt-20 px-6">
          {renderCalendarGrid()}
        </div>

        {/* Render Chat Section */}
    
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default SlotManagement;