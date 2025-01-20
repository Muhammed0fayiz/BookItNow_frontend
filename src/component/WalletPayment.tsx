import React from 'react';

interface WalletPaymentModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  walletBalance?: number;
}

const WalletPaymentModal: React.FC<WalletPaymentModalProps> = ({ 
  show, 
  onClose, 
  onConfirm, 
  amount, 
  walletBalance = 0 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
         
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Wallet Payment Confirmation</h2>
         {/* Important Terms */}
         <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
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
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Payment Amount:</span>
            <span className="font-semibold text-blue-600">₹{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Current Wallet Balance:</span>
            <span className="font-semibold text-green-600">₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>

        {walletBalance < amount ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center">
            Insufficient wallet balance. Please add funds to your wallet.
          </div>
        ) : (
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to proceed with the wallet payment?
          </p>
        )}

        <div className="flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={walletBalance < amount}
            className={`flex-1 py-3 rounded-lg text-white transition-colors ${
              walletBalance < amount 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentModal;