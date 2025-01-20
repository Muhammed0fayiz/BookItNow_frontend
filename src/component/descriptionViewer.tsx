import React, { useState } from 'react';
import { X, BookOpen, ChevronRight } from 'lucide-react';

interface DescriptionViewerProps {
  description: string;
  maxLength?: number;
  title?: string;
}

const DescriptionViewer = ({ description, maxLength = 100, title = '' }: DescriptionViewerProps) => {
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
          <button
            onClick={() => setShowModal(true)}
            className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group transition-all duration-200"
            type="button"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Read More</span>
            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-200 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {title || 'Event Description'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
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
            <div className="flex justify-end items-center p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md"
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