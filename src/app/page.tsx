// 'use client';
import { djparty, motivationspeaker, music } from '@/datas/homepagedatas';
import React, { useState } from 'react';


const GuestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
              BookItNow
            </a>
          </div>
          <div>
            <a
              href="/auth"
              className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Rest of your GuestPage content */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BookItNow</h1>
        <p className="mt-4 text-lg">Find and book your favorite events, shows, and more!</p>
        <a href="#events" className="mt-8 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
          Explore Events
        </a>
      </header>

      {/* Featured Events Section */}
      <section id="events" className="py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-8 animate__animated animate__fadeIn">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event Card 1 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-3s">
            <img src={music.img} alt="Comedy Night" className="w-full h-48 object-cover" />
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Comedy Night</h3>
                <p className="text-gray-600 mb-4">Date: October 12, 2024 | Location: New York City</p>
              </div>
              <div className="text-center mb-4">
                <a href="/book" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                  Book Now
                </a>
              </div>
            </div>
          </div>

          {/* Event Card 2 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-4s">
            <img src={djparty.img} alt="Music Fest" className="w-full h-48 object-cover" />
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Music Fest</h3>
                <p className="text-gray-600 mb-4">Date: November 5, 2024 | Location: Los Angeles</p>
              </div>
              <div className="text-center mb-4">
                <a href="/book" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                  Book Now
                </a>
              </div>
            </div>
          </div>

          {/* Event Card 3 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-5s">
            <img src={motivationspeaker.img} alt="Theater Show" className="w-full h-48 object-cover" />
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Theater Show</h3>
                <p className="text-gray-600 mb-4">Date: December 20, 2024 | Location: San Francisco</p>
              </div>
              <div className="text-center mb-4">
                <a href="/book" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 animate__animated animate__fadeIn">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-lg italic text-center animate__animated animate__fadeIn animate__delay-1s">
            "Booking an event has never been this easy! Highly recommend BookItNow."
          </blockquote>
          <cite className="block text-right mt-4 animate__animated animate__fadeIn animate__delay-2s">- Muhammed Fayiz</cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestPage;
