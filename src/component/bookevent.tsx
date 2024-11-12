import React from 'react';
import { Calendar, Clock, MapPin, User, Phone, Navigation, DollarSign } from 'lucide-react';

const BookingForm = () => {
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Processing payment...');
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <h2 className="text-2xl text-center font-bold">Book Your Event</h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <User className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Date Field */}
          <div className="relative">
            <Calendar className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="date"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Time Field */}
          <div className="relative">
            <Clock className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="time"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Place Field */}
          <div className="relative">
            <MapPin className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Location"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Contact Number Field */}
          <div className="relative">
            <Phone className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="tel"
              placeholder="Contact Number"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Coordinates Field */}
          <div className="relative">
            <Navigation className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Coordinates (Lat, Long)"
              className="pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <DollarSign size={18} />
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
