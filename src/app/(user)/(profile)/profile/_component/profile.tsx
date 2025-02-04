// pages/profile.tsx
"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Bell, Wallet } from "lucide-react"
import EditProfileForm from "@/component/edituserprofile"
import ChangePasswordForm from "@/component/changepassword"
import useUserStore from "@/store/useUserStore"
import Image from "next/image";
import { loginImage } from "@/datas/logindatas"
import Sidebar from "@/component/userSidebar"
import useChatNotifications from "@/store/useChatNotification"
import { useUpcomingEventsStore } from "@/store/useUserUpcomingEvents"
import { useUserEventHistory } from "@/store/useUserEventHistory"
import Navbar from "@/component/userNavbar"

const Profile = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false) // Added state for overall loading
  const { totalCount: upcomingEventsTotalCount, fetchAllEvents: fetchUpcomingEvents } = useUpcomingEventsStore()
  const { totalCount: userEventHistoryTotalCount, fetchAllEvents: fetchUserEventHistory } = useUserEventHistory()
  const { userProfile, isLoading, error, fetchUserProfile, handleLogout } = useUserStore()
  const {fetchNotifications } = useChatNotifications()

  useEffect(() => {
    setIsModalOpen(false)
    setIsChangePasswordModalOpen(false)
  
    const initializeData = async () => {
      try {
        await Promise.all([fetchNotifications(), fetchUserProfile(), fetchUpcomingEvents(), fetchUserEventHistory()])
        setIsAllDataLoaded(true)
      } catch (err) {
        console.error("Error initializing data:", err)
        setIsAllDataLoaded(true) // Set to true even on error to show error state
      }
    }
  
    initializeData()
  
    return () => {
      setIsModalOpen(false)
      setIsChangePasswordModalOpen(false)
    }
  }, [fetchNotifications, fetchUserProfile, fetchUpcomingEvents, fetchUserEventHistory]) // Add dependencies here
  

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
        setIsChangePasswordModalOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscapeKey)
    return () => window.removeEventListener("keydown", handleEscapeKey)
  }, [])
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const handleModalClose = async () => {
    setIsModalOpen(false)
    await fetchUserProfile()
  }

  const handlePasswordModalClose = async () => {
    setIsChangePasswordModalOpen(false)
    await fetchUserProfile()
  }

  if (!isAllDataLoaded || isLoading) {
    // Updated loading condition
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <span className="text-red-500 text-6xl mb-4">⚠️</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchUserProfile()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} pageTitle="My Profile" />

        {/* Main Content */}
        <div className="pt-16 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Profile Image */}
                <div className="absolute -top-16 left-6">
                  <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <Image
                      src={userProfile?.profileImage || loginImage.img}
                      alt="Profile"
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = loginImage.img
                      }}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{userProfile?.username || "Guest"}</h1>
                      <p className="text-gray-600">{userProfile?.email || "guest@example.com"}</p>
                    </div>
                    <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                        <Wallet className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ₹{userProfile?.walletBalance?.toFixed(2) || "0.00"}
                      </h3>
                      <p className="text-gray-600">Wallet Balance</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                        <Bell className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{upcomingEventsTotalCount}</h3>
                      <p className="text-gray-600">Upcoming Events</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{userEventHistoryTotalCount}</h3>
                      <p className="text-gray-600">Event History</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => handleModalClose()}
        >
          <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <EditProfileForm
              onClose={handleModalClose}
              username={userProfile?.username || ""}
              userID={userProfile?.id || ""}
            />
          </div>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => handlePasswordModalClose()}
        >
          <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <ChangePasswordForm onClose={handlePasswordModalClose} userId={userProfile?.id || ""} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile