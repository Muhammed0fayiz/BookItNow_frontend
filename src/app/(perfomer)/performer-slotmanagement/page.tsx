'use client'
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send, Plus, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isAfter } from 'date-fns';

// Sidebar Component
import Sidebar from '@/component/performersidebar';

// Store Hooks
import { useUIStore } from '@/store/useUIStore';
import usePerformerStore from '@/store/usePerformerStore';
import axiosInstance from '@/shared/axiousintance';
import { useSlotStore } from '@/store/useslotDetails';

// Type Definitions
interface Slot {
  id: string;
  date: Date;
  isBooked: boolean;
}

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

// Reusable Dashboard Section Component
const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const PerformerDashboard: React.FC = () => {
  // State Management
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slotss, setSlots] = useState<Slot[]>([]);
  const { slots, fetchSlotDetails, isLoading, error } = useSlotStore();

  // Hooks
  const router = useRouter();
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();

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
    if (isAfter(new Date(), date)) {
      alert("Cannot add slots for past dates");
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/performer/updateSlotStatus/${performerDetails?.PId}`, {
        date: date.toISOString(),
        action: 'add'
      },{withCredentials:true});
  
      if (response.data.status === 403) {
        alert(response.data.message || "Slot already exists or cannot be added");
     
        return;
      }
  
      if (response.data.success) {
        setSlots(prevSlots => [...prevSlots, { 
          id: `slot-${Date.now()}`, 
          date, 
          isBooked: false 
        }]);
        fetchSlotDetails('performerId');
      } else {
        alert(response.data.message || "Failed to add slot");
      }
      fetchSlotDetails('performerId');
    } catch (error) {
      console.error("Error adding slot:", error);
      alert('This day is already booked for an event.');

    }
  };
  
  const handleRemoveSlot = async (slotId: string) => {
    try {
      const slotToRemove = slotss.find(slot => slot.id === slotId);
      if (!slotToRemove) {
        alert("Slot not found");
        return;
      }
  
      const response = await axiosInstance.post(`/performer/updateSlotStatus/${performerDetails?.PId}`, {
        date: slotToRemove.date.toISOString(),
        action: 'remove'
      },{withCredentials:true});
    
      if (response.data.success) {
        setSlots(prevSlots => prevSlots.filter(slot => slot.id !== slotId));
      } else {
        alert(response.data.message || "Failed to remove slot");
      }  fetchSlotDetails('performerId');
    } catch (error) {
      console.error("Error removing slot:", error);
      alert("Failed to remove slot. Please try again.");
    }
  };

  // Authentication Handler
  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  // Side Effects
  useEffect(() => {
    fetchPerformerDetails();

  }, [fetchPerformerDetails]);

  useEffect(() => {
    fetchSlotDetails('performerId');
    console.log('fayi',slots)
  }, []);

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

  // Chat Component
  const renderChatSection = () => (
    <div className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 ${chatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={toggleChat} className="text-white">
          <Menu size={20} />
        </button>
      </div>
      <div className="h-80 overflow-y-auto p-4">
        {/* Chat messages would go here */}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          {/* Chat input would go here */}
        </div>
      </div>
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
              <MessageCircle size={24} />
            </button>
          </div>
        </nav>

        {/* Render Calendar Grid */}
        <div className="pt-20 px-6">
          {renderCalendarGrid()}
        </div>

        {/* Render Chat Section */}
        {renderChatSection()}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default PerformerDashboard;