import React from 'react';

interface WalletPaymentTermsModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WalletPaymentTermsModal: React.FC<WalletPaymentTermsModalProps> = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Payment Terms</h2>
        
        <ul className="space-y-3 text-gray-700 mb-6 list-disc pl-5">
          <li>Cancellation is not allowed 24 hours before the event</li>
          <li>10% advance payment is required to confirm booking</li>
          <li>₹10 app fee is non-refundable</li>
        </ul>
        
        <div className="flex justify-between space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentTermsModal;