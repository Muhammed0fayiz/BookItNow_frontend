'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, History,Music, Star, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/component/ui/card';
import { PerformerDetails } from '@/types/store';
import usePerformerStore from '@/store/usePerformerStore';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import ChangePasswordForm from '@/component/changepassword';
import EditPerformerProfileForm from '@/component/editPerformerProfile';
import { useEventHistory } from '@/store/usePerformerEventHistory';
import { useUpcomingEventsStore } from '@/store/useperformerupcomingevent';
import useUserStore from '@/store/useUserStore';
import usePerformerAllDetails from '@/store/usePerformerAllDetails';
import Image from "next/image";
import useChatNotifications from '@/store/useChatNotification';
import { Menu} from 'lucide-react';
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

interface ProfileButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

interface PerformerProfileProps {
  performerDetails: PerformerDetails | null;
  onUpdateProfile: () => void;
  onChangePassword: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent>
      <div className="flex items-center gap-4">
        <Icon className={`w-8 h-8 ${label.includes('Reviews') ? 'text-yellow-500' : 'text-blue-600'}`} />
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick, variant, children }) => (
  <button
    onClick={onClick}
    className={`w-full py-2 px-4 rounded-lg transition-colors ${
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const PerformerProfile: React.FC<PerformerProfileProps> = ({
  performerDetails,
  onUpdateProfile,
  onChangePassword,
}) => {
  const { fetchAllEvents: fetchEventHistoryEvents, totalCount: eventHistoryTotalCount } = useEventHistory();
  const { fetchAllEvents: fetchUpcomingEvents, totalCount: upcomingEventsTotalCount } = useUpcomingEventsStore();

  const {fetchPerformerAllDetails } = usePerformerAllDetails();
  

  const { userProfile } = useUserStore();
  const statCards = [
    { icon: Calendar, label: 'Upcoming Events', value: upcomingEventsTotalCount|| 10 },
    { icon: History, label: 'Past Events', value:  eventHistoryTotalCount|| 0 },
    { icon: Wallet, label: 'Wallet Balance', value: `₹${userProfile?.walletBalance?.toFixed(2) || '0.00'}` },
    { icon: Star, label: 'Total Reviews', value: performerDetails?.totalReviews || 0 },
  ];
  
  useEffect(()=>{
fetchEventHistoryEvents()
fetchUpcomingEvents()
  },[fetchEventHistoryEvents,fetchUpcomingEvents])
  useEffect(() => {
    const userId = usePerformerAllDetails.getState().getUserIdFromToken();
    if (userId) {
      fetchPerformerAllDetails(userId);
    }
  }, [fetchPerformerAllDetails]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Section */}
        <div className="md:w-1/3">
          {/* Profile Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={performerDetails?.imageUrl || performerDetails?.image || "http://i.pravatar.cc/250?img=58"}
              alt={performerDetails?.bandName || 'Profile Image'}
              width={500}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Profile Info */}
          <h2 className="text-2xl font-bold mb-2">
            {performerDetails?.bandName || 'Loading...'}
          </h2>

          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Music size={18} />
            <span>{performerDetails?.mobileNumber || 'Genre not specified'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar size={18} />
            <span>{performerDetails?.place || 'Location not specified'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Star size={18} className="text-yellow-500" />
            <span>{performerDetails?.rating || '0'} Rating</span>
          </div>

          {performerDetails?.description && (
            <p className="text-gray-600 mb-4">
              {performerDetails.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <ProfileButton variant="primary" onClick={onUpdateProfile}>
              Update Profile
            </ProfileButton>
            <ProfileButton variant="secondary" onClick={onChangePassword}>
              Change Password
            </ProfileButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformerProfileContainer: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const {fetchUserProfile } = useUserStore();
  const {fetchAllEvents } = useUpcomingEventsStore();
  const { totalUnreadMessage, fetchNotifications } = useChatNotifications();
  useEffect(() => {
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchPerformerDetails(),
        fetchUserProfile(),
        fetchAllEvents(),
      ]);
    };
    loadInitialData();
  }, [fetchPerformerDetails, fetchUserProfile, fetchAllEvents]);

  const handleUpdateProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsChangePasswordModalOpen(false);
      setIsEditProfileModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-64">
      <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
            
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

          </div>
        </nav>

        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <PerformerProfile
            performerDetails={performerDetails}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        </div>

        {/* Password Change Modal */}
        {isChangePasswordModalOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={handleOverlayClick}></div>
            <div className="fixed inset-0 flex justify-center items-center z-50" onClick={handleOverlayClick}>
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <ChangePasswordForm 
                  onClose={() => setIsChangePasswordModalOpen(false)}
                  userId={performerDetails?.userId || ''}
                />
              </div>
            </div>
          </>
        )}

        {/* Edit Profile Modal */}
        {isEditProfileModalOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={handleOverlayClick}></div>
            <div className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={handleOverlayClick}>
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <EditPerformerProfileForm
                  performerDetails={performerDetails}
                  onClose={() => setIsEditProfileModalOpen(false)}
                  onSuccess={() => {
                    setIsEditProfileModalOpen(false);
                    fetchPerformerDetails();
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={toggleSidebar}></div>
        )}
      </div>
    </div>
  );
};

export default PerformerProfileContainer;