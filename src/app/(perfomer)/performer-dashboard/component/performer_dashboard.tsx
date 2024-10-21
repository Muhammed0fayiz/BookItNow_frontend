'use client'
import React, { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, UserCircle, Calendar, Clock, LogOut, MessageCircle, Send, LayoutDashboard } from 'lucide-react';
import axiosInstance from '@/shared/axiousintance';


interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'performer';
}

interface PerformerDetails {
  bandName: string;
  place: string;
  rating: number;
  description: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [performerDetails, setPerformerDetails] = useState<PerformerDetails | null>(null);

  useEffect(() => {
   
    const fetchPerformerDetails = async () => {
      try {
        const token = getCookie('userToken');
        if (token) {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          const userId = decodedPayload.id;
          
          const response = await axiosInstance.get(`/getPerfomer/${userId}`);
          if (response.data) {
            setPerformerDetails(response.data.response);
          }
        }
      } catch (error) {
        console.error('Failed to fetch performer details:', error);
      }
   
    };

    fetchPerformerDetails();
  }, []);

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length > 1) return parts[1].split(';')[0];
    return undefined;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'performer' }]);
      setNewMessage('');
    }
  };

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-20`}>
        {/* Performer Avatar and Name */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
            <img
              src="/api/placeholder/48/48"
              alt="Performer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-md font-semibold">{performerDetails?.bandName || 'Loading...'}</h3>
            <span className="text-sm font-light">Performer</span>
          </div>
        </div>

        {/* Sidebar Links */}
        <ul className="space-y-4">
          <li>
            <a href="#dashboard" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
              <LayoutDashboard className="mr-2" size={20} /> Dashboard
            </a>
          </li>
          <li>
            <a href="#eventmanagement" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
              <Calendar className="mr-2" size={20} /> Events Details
            </a>
          </li>
          <li>
            <a href="#slotmanagement" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
              <Clock className="mr-2" size={20} /> Slot Management
            </a>
          </li>
          <li>
            <a href="#upcomingevents" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
              <Calendar className="mr-2" size={20} /> Upcoming Events
            </a>
          </li>
          <li>
            <a href="#eventhistory" className="flex items-center text-lg hover:bg-blue-700 p-3 rounded">
              <Clock className="mr-2" size={20} /> Event History
            </a>
          </li>
          <li>
            <a className="flex items-center text-lg hover:bg-blue-700 p-3 rounded cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2" size={20} /> Logout
            </a>
          </li>
        </ul>
      </aside>

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

        {/* Performer Content Section */}
        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <DashboardSection title="Dashboard">
            <p>Welcome to your dashboard, {performerDetails?.bandName}. Here's an overview of your activities.</p>
            <p>Location: {performerDetails?.place}</p>
            <p>Rating: {performerDetails?.rating}</p>
            <p>Description: {performerDetails?.description}</p>
          </DashboardSection>

          <DashboardSection title="Event Management">
            <p>Manage your events here.</p>
          </DashboardSection>

          <DashboardSection title="Slot Management">
            <p>Manage your available time slots.</p>
          </DashboardSection>

          <DashboardSection title="Upcoming Events">
            <p>View your upcoming events.</p>
          </DashboardSection>

          <DashboardSection title="Event History">
            <p>Review your past events.</p>
          </DashboardSection>
        </div>

        {/* Chat Section */}
        <div className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 ${chatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-white">
              <Menu size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-2 ${msg.sender === 'performer' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'performer' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-l-lg p-2"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg">
                <Send size={20} />
              </button>
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

export default PerformerDashboard;