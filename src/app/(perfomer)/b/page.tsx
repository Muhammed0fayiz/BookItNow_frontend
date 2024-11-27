'use client'
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday, 
  isSameMonth, 
  isAfter,
  addMonths,
  subMonths
} from 'date-fns';

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
  startTime?: string;
  endTime?: string;
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slotss, setSlots] = useState<Slot[]>([]);
  const { slots, fetchSlotDetails, isLoading, error } = useSlotStore();

  // Hooks
  const router = useRouter();
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();

  // Memoized Calendar Days Calculation for Single Month
  const monthDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    return eachDayOfInterval({ 
      start: firstDayOfMonth, 
      end: lastDayOfMonth 
    });
  }, [currentMonth]);

  // Navigate Month
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Slot Management Handlers
  const handleAddSlot = async (date: Date) => {
    if (isAfter(new Date(), date)) {
      alert("Cannot add slots for past dates");
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/performer/updateSlotStatus/${performerDetails?.PId}`, {
        date: date.toISOString(),
        action: 'add',
        startTime: '09:00', // Default start time
        endTime: '17:00'    // Default end time
      });
  
      if (response.data.success) {
        setSlots(prevSlots => [...prevSlots, { 
          id: `slot-${Date.now()}`, 
          date, 
          isBooked: false,
          startTime: '09:00',
          endTime: '17:00'
        }]);
      } else {
        alert(response.data.message || "Failed to add slot");
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Failed to add slot. Please try again.");
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
      });
  
      if (response.data.success) {
        setSlots(prevSlots => prevSlots.filter(slot => slot.id !== slotId));
      } else {
        alert(response.data.message || "Failed to remove slot");
      }
    } catch (error) {
      console.error("Error removing slot:", error);
      alert("Failed to remove slot. Please try again.");
    }
  };

  // Render Month View
  const renderMonthView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')} Slot Management
        </h2>
        <button 
          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
          onClick={handleNextMonth}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {monthDays.map(date => {
          const daySlots = slotss.filter(
            slot => slot.date.toDateString() === date.toDateString()
          );
          
          return (
            <div 
              key={date.toISOString()} 
              className={`
                relative p-2 border rounded-lg text-center
                ${isToday(date) ? 'bg-blue-100 border-blue-300' : 'bg-white'}
                ${daySlots.length > 0 ? 'bg-green-50 border-green-200' : ''}
              `}
            >
              <div className="flex flex-col">
                <span className={`
                  text-sm font-semibold
                  ${isToday(date) ? 'text-blue-600' : 'text-gray-700'}
                `}>
                  {date.getDate()}
                </span>
                
                {daySlots.length > 0 && (
                  <div className="mt-1 text-xs text-green-600">
                    {daySlots.map(slot => (
                      <div key={slot.id}>
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedDate(date)}
                className="absolute inset-0 hover:bg-opacity-10 hover:bg-blue-500 rounded-lg"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  // Slot Details Modal
  const renderSlotDetailsModal = () => {
    if (!selectedDate) return null;

    const daySlots = slotss.filter(
      slot => slot.date.toDateString() === selectedDate.toDateString()
    );

    return (
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
            <h4 className="text-md font-medium">Available Slots</h4>
            <button 
              className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
              onClick={() => handleAddSlot(selectedDate)}
            >
              <Plus size={20} />
            </button>
          </div>

          {daySlots.length > 0 ? (
            daySlots.map(slot => (
              <div 
                key={slot.id} 
                className="flex justify-between items-center p-2 border rounded-lg mb-2"
              >
                <div>
                  {slot.startTime} - {slot.endTime}
                  {slot.isBooked && <span className="text-red-500 ml-2">(Booked)</span>}
                </div>
                <button 
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                  onClick={() => handleRemoveSlot(slot.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No slots for this date</p>
          )}
        </div>
      </div>
    );
  };

  // Rest of the component remains the same as in the original code

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={() => {
          document.cookie = 'userToken=; Max-Age=0; path=/;';
          setTimeout(() => {
            router.replace('/auth');
          }, 1000);
        }}
      />

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

        {/* Render Month View */}
        <div className="pt-20 px-6">
          {renderMonthView()}
        </div>

        {/* Render Slot Details Modal */}
        {renderSlotDetailsModal()}

        {/* Chat Section and Mobile Overlay from original code */}
      </div>
    </div>
  );
};

export default PerformerDashboard;