'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, History, LogOut, Music, Star, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/component/ui/card';
import { PerformerDetails, PerformerStats } from '@/types/store';
import usePerformerStore from '@/store/usePerformerStore';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import ChangePasswordForm from '@/component/changepassword';
import EditPerformerProfileForm from '@/component/editPerformerProfile';

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
  stats?: PerformerStats;
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
  stats = {
    upcomingEvents: 0,
    pastEvents: 0,
    walletBalance: 0,
    totalReviews: 0
  },
  onUpdateProfile,
  onChangePassword,
}) => {
  const statCards = [
    { icon: Calendar, label: 'Upcoming Events', value: stats.upcomingEvents },
    { icon: History, label: 'Past Events', value: stats.pastEvents },
    { icon: Wallet, label: 'Wallet Balance', value: `₹${stats.walletBalance}` },
    { icon: Star, label: 'Total Reviews', value: performerDetails?.totalReviews || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Section */}
        <div className="md:w-1/3">
          {/* Profile Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
            <img
              src={performerDetails?.imageUrl || performerDetails?.image || "http://i.pravatar.cc/250?img=58"}
              alt={performerDetails?.bandName || 'Profile Image'}
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
  const { performerDetails, stats, fetchPerformerDetails, handleLogout: storeHandleLogout } = usePerformerStore();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  React.useEffect(() => {
    fetchPerformerDetails();
  }, [fetchPerformerDetails]);

  const handleUpdateProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleLogout = () => {
    storeHandleLogout();
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    router.push('/auth');
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
          <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
            <Calendar size={24} />
          </button>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow - Profile</h1>
        </nav>

        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <PerformerProfile
            performerDetails={performerDetails}
            stats={stats}
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
    fetchPerformerDetails(); // Refresh profile data after update
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