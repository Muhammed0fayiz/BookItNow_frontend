"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useChatNotifications from "@/store/useChatNotification";

const About = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalUnreadMessage, notifications, fetchNotifications } =
    useChatNotifications();

  useEffect(() => {
    fetchNotifications().catch((err) =>
      console.error("Error fetching notifications:", err)
    );
  }, [fetchNotifications]);

  const teamMember = {
    name: "Muhammed Fayiz",
    role: "Founder & CEO",
    description:
      "Passionate about connecting people with amazing events through BookItNow. Creating seamless experiences for event organizers and attendees.",
    facebook: "https://www.facebook.com/share/1JLe61aajw/",
    instagram: "fayiz_fai_zy123",
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const profilePage = () => {
    router.replace("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        {/* Navigation code remains the same */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href="/home"
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
            >
              BookItNow
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

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
                 className="text-blue-600 font-semibold transition duration-300"
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z"
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
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                  onClick={profilePage}
                >
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About BookItNow</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your premier destination for discovering and booking amazing events.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At BookItNow, we're committed to creating a seamless platform
              where event organizers and attendees connect effortlessly. Our
              goal is to make event discovery and booking as simple as possible
              while ensuring quality experiences for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose BookItNow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Book your favorite events with just a few clicks
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-4">
                Verified Performers
              </h3>
              <p className="text-gray-600">
                Quality entertainment from trusted professionals
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-blue-600 text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Always here to help with your booking needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Meet the Founder
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="mb-6">
                <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-2xl font-semibold mb-2">
                  {teamMember.name}
                </h3>
                <p className="text-blue-600 mb-4">{teamMember.role}</p>
                <p className="text-gray-600 mb-6">{teamMember.description}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={`https://facebook.com/${teamMember.facebook}`}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href={`https://instagram.com/${teamMember.instagram}`}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z"></path>
                      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6-9a1 1 0 100-2 1 1 0 000 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
          <a
            href="mailto:fayiz149165@gmail.com"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 BookItNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
