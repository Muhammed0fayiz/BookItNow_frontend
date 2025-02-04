import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowUp,TrendingUp } from 'lucide-react';
import usePerformerAllDetails from '@/store/usePerformerAllDetails';

// Color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Performance Overview Card
export const PerformanceOverviewCard: React.FC = () => {
  const { performerAllDetails } = usePerformerAllDetails();

  const statsData = [
    { 
      icon: <ArrowUp className="text-blue-500" />, 
      title: 'Total Events', 
      value: performerAllDetails?.totalPrograms || 0,
      // change: 8 
    },
    { 
      icon: <TrendingUp className="text-green-500" />, 
      title: 'Total Programs', 
      value: performerAllDetails?.totalEvent || 0,
      // change: 12 
    },
  
    { 
      icon: <ArrowUp className="text-blue-500" />, 
      title: 'Total Reviews', 
      value: performerAllDetails?.totalReviews || 0,
      // change: -3 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-md p-4 flex items-center hover:shadow-lg transition-shadow duration-300"
        >
          <div className="mr-4">{stat.icon}</div>
          <div>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{stat.value}</span>
              {/* <span className={`text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Event History Chart
export const EventHistoryChart: React.FC = () => {
  const { performerAllDetails } = usePerformerAllDetails();

  const eventHistoryData = performerAllDetails?.totalEventsHistory 
    ? Object.entries(performerAllDetails.totalEventsHistory).map(([month, events]) => ({
        month,
        events
      }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">Event History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={eventHistoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="events" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Wallet Transaction Chart
export const WalletTransactionChart: React.FC = () => {
  const { performerAllDetails } = usePerformerAllDetails();

  const transactionData = performerAllDetails?.walletTransactionHistory 
    ? Object.entries(performerAllDetails.walletTransactionHistory).map(([month, amount]) => ({
        month,
        amount
      }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">Wallet Transactions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={transactionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Upcoming Events Pie Chart
export const UpcomingEventsPieChart: React.FC = () => {
  const { performerAllDetails } = usePerformerAllDetails();

  const upcomingEventsData = performerAllDetails?.upcomingEvents 
    ? Object.entries(performerAllDetails.upcomingEvents).map(([type, count]) => ({
        type,
        count
      }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={upcomingEventsData}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            label
          >
            {upcomingEventsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const Charts = {
  PerformanceOverviewCard,
  EventHistoryChart,
  WalletTransactionChart,
  UpcomingEventsPieChart
};

export default Charts;