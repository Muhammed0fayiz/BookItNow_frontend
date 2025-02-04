import React, { useState, useEffect } from 'react';
import { X, BookOpen, ChevronRight } from 'lucide-react';

interface DescriptionViewerProps {
  description: string;
  maxLength?: number;
  title?: string;
}

const DescriptionViewer = ({ description, maxLength = 100, title = '' }: DescriptionViewerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  const truncateDescription = (text: string): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setAnimateContent(true), 100);
      return () => clearTimeout(timer);
    }
    setAnimateContent(false);
  }, [showModal]);

  return (
    <>
      <div className="text-sm text-gray-600 max-w-md">
        {truncateDescription(description)}
        {description.length > maxLength && (
          <button
            onClick={() => setShowModal(true)}
            className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
            type="button"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Read More</span>
            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300">
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {title || 'Description'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className={`transition-all duration-500 ${
                animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed text-base mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
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

export default DescriptionViewer;