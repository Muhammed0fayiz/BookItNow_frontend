import React, { useState } from 'react';
import { Book, X, Maximize2 } from 'lucide-react';

interface DescriptionViewerProps {
  description: string;
  maxLength?: number;
  title?: string;
}

const CreativeDescriptionViewer = ({ 
  description, 
  maxLength = 100, 
  title = 'Description' 
}: DescriptionViewerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const truncateDescription = (text: string): string => {
    return text.length > maxLength 
      ? text.slice(0, maxLength) + '...' 
      : text;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <div className="text-sm text-gray-600">
        {truncateDescription(description)}
        {description.length > maxLength && (
          <span 
            onClick={() => setShowModal(true)}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer underline decoration-blue-300"
          >
            Read More
          </span>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            className={`bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
              isFullScreen 
                ? 'w-[95vw] h-[95vh]' 
                : 'w-full max-w-2xl h-[70vh]'
            } flex flex-col relative overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6" />
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={toggleFullScreen}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="hover:bg-red-500/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              <div className="prose max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {description.split('\n').map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-4 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreativeDescriptionViewer;