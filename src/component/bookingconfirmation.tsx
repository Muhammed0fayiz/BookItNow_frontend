import React from 'react';
import { Info, X } from 'lucide-react';

interface BookingConfirmationModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  eventPrice: number;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  show,
  onConfirm,
  onCancel,
  eventPrice
}) => {
  if (!show) return null;

  const advanceAmount = eventPrice * 0.1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="relative border-b p-4">
          <button 
            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mx-auto" />
          </button>
          <h2 className="text-xl font-semibold text-center">
            Confirm Your Booking
          </h2>
        </div>

        <div className="p-6">
          {/* Important Terms */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
              <Info className="h-5 w-5" />
              Important Terms
            </h3>
            <ul className="space-y-2 text-sm text-blue-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Cancellation is not allowed 24 hours before the event</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>10% advance payment is required to confirm booking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>₹10 app fee is non-refundable</span>
              </li>
            </ul>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Advance Payment (10%)</span>
              <span className="font-semibold">₹{advanceAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">App Fee</span>
              <span className="font-semibold">₹10.00</span>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>Total Amount Due Now</span>
              <span>₹{(advanceAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t p-4">
          <button
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            onClick={onConfirm}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;