'use client'
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart2, 
  DollarSign, 
  Star, 
  Calendar, 
  Music, 
  PieChart 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart as RechartPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Stores and Imports (assumed to be same as previous implementation)
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import usePerformerStore from '@/store/usePerformerStore';
import usePerformerAllDetails from '@/store/usePerformerAllDetails';

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  
  // Store hooks
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const { performerAllDetails, fetchPerformerAllDetails } = usePerformerAllDetails();

  // Data Transformation Hooks
  const eventHistoryData = useMemo(() => {
    const history = performerAllDetails?.totalEventsHistory || {};
    return Object.entries(history).map(([date, count]) => ({
      date,
      events: count
    }));
  }, [performerAllDetails?.totalEventsHistory]);

  const performanceData = useMemo(() => [
    { name: 'Events', value: performerAllDetails?.totalEvent || 0 },
    { name: 'Reviews', value: performerAllDetails?.totalReviews || 0 },
    { name: 'Programs', value: performerAllDetails?.totalPrograms || 0 }
  ], [performerAllDetails]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Lifecycle Effects


  useEffect(() => {
    const userId = usePerformerAllDetails.getState().getUserIdFromToken();
    if (userId) {
      fetchPerformerAllDetails(userId);
      fetchPerformerDetails();
    
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Overview Cards */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex items-center space-x-4 transform transition hover:scale-105">
            <Calendar className="text-blue-400" size={40} />
            <div>
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">Total Events</h3>
              <p className="text-2xl font-bold text-white">
                {performerAllDetails?.totalEvent || 0}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex items-center space-x-4 transform transition hover:scale-105">
            <Star className="text-yellow-400" size={40} />
            <div>
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">Total Reviews</h3>
              <p className="text-2xl font-bold text-white">
                {performerAllDetails?.totalReviews || 0}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex items-center space-x-4 transform transition hover:scale-105">
            <DollarSign className="text-green-400" size={40} />
            <div>
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">Wallet Balance</h3>
              <p className="text-2xl font-bold text-white">
                ₹{performerAllDetails?.walletAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Events History Bar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl col-span-full">
            <div className="flex items-center mb-4">
              <BarChart2 className="text-blue-400 mr-2" size={24} />
              <h3 className="text-xl font-semibold text-white">Events History</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#333', 
                    borderColor: '#555',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="events" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Breakdown Pie Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <PieChart className="text-purple-400 mr-2" size={24} />
              <h3 className="text-xl font-semibold text-white">Performance Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartPieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#333', 
                    borderColor: '#555',
                    color: '#fff' 
                  }} 
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>

          {/* Band Details Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <Music className="text-pink-400 mr-2" size={24} />
              <h3 className="text-xl font-semibold text-white">Band Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Band Name</span>
                <p className="text-white">{performerDetails?.bandName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Location</span>
                <p className="text-white">{performerDetails?.place || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Genre</span>
                <p className="text-white">{performerDetails?.genre || 'Not Specified'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Rating</span>
                <p className="text-white">
                  {performerDetails?.rating?.toFixed(2) || 'N/A'} / 5
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformerDashboard;







