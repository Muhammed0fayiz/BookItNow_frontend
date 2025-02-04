"use client";
import Image from "next/image"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAllEventsStore from "@/store/useAllEvents";
import usePerformersStore from "@/store/useAllPerformerStore";
import useUserStore from "@/store/useUserStore";
import axiosInstance from "@/shared/axiousintance";
import useChatNotifications from "@/store/useChatNotification";
import DescriptionViewer from "@/component/performerDiscription";
// import DescriptionViewer from '@/component/descriptionViewer';
// Interfaces for type safety

const PerformerDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const performerId = params.performerid as string;

  const { events, fetchAllEvents } = useAllEventsStore();
  const { performers, fetchAllPerformers } = usePerformersStore();
  const [activeTab, setActiveTab] = useState<"about" | "events">("about");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, fetchUserProfile, } =
    useUserStore();
  const { totalUnreadMessage,fetchNotifications } =
    useChatNotifications();
  // Fetch events and performers on component mount
  useEffect(() => {
    fetchAllEvents();
    fetchAllPerformers();
  }, [fetchAllEvents, fetchAllPerformers]);
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    fetchNotifications().catch((err) =>
      console.error("Error fetching notifications:", err)
    );
  }, [fetchNotifications]);

  const performer = performers.find((p) => p.userId === performerId);

  const performerEvents = events.filter(
    (event) => event.userId === performerId && event.status === "active"
  );

  if (!performer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Performer not found.</p>
      </div>
    );
  }

  // Navigation handlers
  const profilePage = () => {
    router.replace("/profile");
  };

  const startChatWithPerformer = async () => {
    try {
      await axiosInstance.post(
        `/chat/chatwithPerformer/${userProfile?.id}/${performerId}`
      );

      router.push("/chat");
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
            >
              BookItNow
            </a>
          </div>

          {/* Menu Button for Small Devices */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

          {/* Full Navbar for Large Devices */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/home"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Home
            </a>
            <a
              href="/events"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Events
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              About
            </a>
            <a
              href="/chat"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5z"
                />
              </svg>
              {totalUnreadMessage > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalUnreadMessage}
                </span>
              )}
            </a>
            <a
              href="/profile"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Sidebar for Small Devices */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={toggleMenu}
              >
                &times;
              </button>
              <div className="flex flex-col p-6">
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  Home
                </a>
                <a
                  href="/events"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  Events
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  About
                </a>
                <a
                  href="/chat"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  Chat
                </a>
                <a
                  onClick={profilePage}
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            <Image
              src={performer.profileImage || "/default-profile.jpg"}
              alt={performer.bandName}
              width={500}
              height={300}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="mt-6 md:mt-0 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{performer.bandName}</h1>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < performer.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white">
                    {performer.rating.toFixed(1)} ({performer.totalReviews}{" "}
                    reviews)
                  </span>
                </span>
              </div>
              <p className="text-lg mb-2">📍 {performer.place}</p>
              <p className="text-lg">📞 {performer.mobileNumber}</p>

              {/* Chat Button */}
              <div className="mt-4 flex justify-center md:justify-start space-x-4">
                <button
                  onClick={startChatWithPerformer}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5z"
                    />
                  </svg>
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "about"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "events"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Events ({performerEvents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              About {performer.bandName}
            </h2>
            <p className="text-gray-600 mb-6">    <DescriptionViewer description={performer.description} maxLength={40} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Joined Date</h3>
                <p className="text-gray-600">
  {new Date(performer.createdAt).toLocaleDateString()}
</p>

              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Contact Information
                </h3>
                <p className="text-gray-600">
                  <strong>Mobile:</strong> {performer.mobileNumber}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {performer.place}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {performerEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-gray-600">
                        {event.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4"> <DescriptionViewer description={event.description} maxLength={15} /></p>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Price:</span> ₹
                      {event.price}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Category:</span>{" "}
                      {event.category}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Team Leader:</span>{" "}
                      {event.teamLeader}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Contact:</span>{" "}
                      {event.teamLeaderNumber}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Posted:</span>{" "}
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/events/${event.userId}/${event._id}`)
                    }
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}

            {performerEvents.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600">
                  No active events available from this performer.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">BookItNow</h4>
              <p className="text-gray-600">
                Connect with performers and book amazing events.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/home" className="text-gray-600 hover:text-blue-600">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/events"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/faq" className="text-gray-600 hover:text-blue-600">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-gray-600 hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.281-.072 1.689-.072 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14.02-7.496 14.02-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600 border-t pt-6">
            <p>&copy; 2024 BookItNow. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PerformerDetailsPage;
