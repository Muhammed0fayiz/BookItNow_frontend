import React, { useState } from 'react';
import { X, BookOpen, Users, Tag, Phone } from 'lucide-react';

interface DescriptionViewerProps {
  description: string;
  teamLeader?: string;
  teamLeaderNumber?: string;
  category?: string;
  maxLength?: number;
  title?: string;
}

const Description = ({ 
  description, 
  teamLeader = '', 
  teamLeaderNumber = '', 
  category = '', 
  maxLength = 100, 
  title = '' 
}: DescriptionViewerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const truncateDescription = (text: string): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <>
      <div className="text-sm text-gray-600">
        {truncateDescription(description)}
        {description.length > maxLength && (
          <span 
            onClick={() => setShowModal(true)}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors duration-200"
          >
            View
          </span>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-xl h-[70vh] flex flex-col transform transition-all duration-200 border-4 border-blue-100 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-blue-50/50">
              <div className="flex items-center space-x-4">
                <BookOpen className="w-8 h-8 text-blue-600 bg-blue-100 rounded-full p-1" />
                <h3 className="text-2xl font-bold text-blue-900">
                  {title || 'Event Description'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-red-500 hover:text-red-700 bg-red-100 rounded-full p-2 hover:bg-red-200 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {/* Additional Event Details */}
              <div className="mb-6 space-y-4">
                {teamLeader && (
                  <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg border border-green-100">
                    <Users className="w-6 h-6 text-green-600 bg-green-100 rounded-full p-1" />
                    <div>
                      <span className="font-semibold text-green-900">Team Leader:</span>
                      <span className="ml-2 text-green-700">{teamLeader}</span>
                    </div>
                  </div>
                )}
                {teamLeaderNumber && (
                  <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <Phone className="w-6 h-6 text-purple-600 bg-purple-100 rounded-full p-1" />
                    <div>
                      <span className="font-semibold text-purple-900">Contact:</span>
                      <span className="ml-2 text-purple-700">{teamLeaderNumber}</span>
                    </div>
                  </div>
                )}
                {category && (
                  <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <Tag className="w-6 h-6 text-orange-600 bg-orange-100 rounded-full p-1" />
                    <div>
                      <span className="font-semibold text-orange-900">Category:</span>
                      <span className="ml-2 text-orange-700">{category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Full Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {description.split('\n').map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-6 border-t border-blue-100 bg-blue-50/50">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Description;