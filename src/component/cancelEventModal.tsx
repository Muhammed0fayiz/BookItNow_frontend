import React from 'react';

interface CancelEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventDate: string;
  eventPrice: number;
  isLoading: boolean;
}

const CancelEventModal = ({
  isOpen,
  onClose,
  onConfirm,
  eventDate,
  eventPrice,
  isLoading
}: CancelEventModalProps) => {
  if (!isOpen) return null;

  const calculateRefundAmount = () => {
    const currentDate = new Date();
    const eventDateTime = new Date(eventDate);
    const daysDifference = Math.ceil((eventDateTime.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // App fees is non-refundable
    const appFees = 10;
    
    // If less than 10 days, no refund
    if (daysDifference < 10) {
      return 0;
    }
    
    // Refund formula: 10% of eventPrice - appFees
    const refund = eventPrice * 0.1 - appFees;
    
    // Ensure refund is not negative
    return refund > 0 ? refund : 0;
  };

  const refundAmount = calculateRefundAmount();
  const daysUntilEvent = Math.ceil((new Date(eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Event Cancellation
          </h3>
          <p className="text-sm text-gray-500">
            Please review the cancellation policy before proceeding
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Policy Section */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• App fees (₹10) is non-refundable</li>
              <li>• Cancellations less than 10 days before the event are non-refundable</li>
              <li>• Refund is 10% of event price minus app fees (₹10)</li>
            </ul>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Days until event:</span>
              <span className="font-medium">{daysUntilEvent} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Original payment:</span>
              <span className="font-medium">₹{eventPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">App fees (non-refundable):</span>
              <span className="font-medium">₹10</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Refund amount:</span>
              <span className={refundAmount > 0 ? "text-green-600" : "text-red-600"}>
                ₹{refundAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Keep Event
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelEventModal;
