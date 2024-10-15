'use client';
import React from 'react';

interface NavbarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleMenu, isMenuOpen }) => {
  return (
    <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      {/* Left Side: Logo */}
      <div className="flex items-center space-x-6">
        <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
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
        <a href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
          Home
        </a>
        <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300">
          Events
        </a>
        <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
          About
        </a>
        <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
          </svg>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            3
          </span>
        </a>
        <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z" />
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
            <a href="/" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
              Events
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
              About
            </a>
            <a href="/chat" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
              Chat
            </a>
            <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Profile
            </a>
          </div>
        </div>
      </div>
    )}
  </nav>
  );
};

export default Navbar;
