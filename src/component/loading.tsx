import React from 'react';

const InitialLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Main loading container */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo and brand */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BookItNow
          </h1>
        </div>
        
        {/* Loading animation */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <p className="text-gray-600 font-medium">Loading your events</p>
            <p className="text-sm text-gray-400 mt-1">Please wait a moment...</p>
          </div>
          
          {/* Loading bar */}
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your tailwind.config.js or add inline styles if you can't modify the config
// {
//   theme: {
//     extend: {
//       keyframes: {
//         'loading-bar': {
//           '0%': { transform: 'translateX(-100%)' },
//           '100%': { transform: 'translateX(100%)' }
//         }
//       },
//       animation: {
//         'loading-bar': 'loading-bar 1.5s infinite'
//       }
//     }
//   }
// }

export default InitialLoading;