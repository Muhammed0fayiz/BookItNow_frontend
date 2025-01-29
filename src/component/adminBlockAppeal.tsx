import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import axiosInstance from '@/shared/axiousintance';

interface AdminBlockModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  blockDetails?: {
    reason: string;
    blockedAt: string;
  };
}

const AdminBlockModal: React.FC<AdminBlockModalProps> = ({
  eventId,
  isOpen,
  onClose,
  blockDetails
}) => {
  const [appealMessage, setAppealMessage] = useState('');

  const handleAppeal = async () => {
    if (!appealMessage.trim()) {
      alert('Please provide an appeal message');
      return;
    }

    try {
      await axiosInstance.post(`/performer/appealBlockedEvent/${eventId}`, {
        appealMessage
      });
      alert('Appeal submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      alert('Failed to submit appeal');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <AlertCircle className="mr-2" /> Event Blocked
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {blockDetails && (
          <div className="mb-4 bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Blocked At:</strong> {new Date(blockDetails.blockedAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Reason:</strong> {blockDetails.reason || 'No specific reason provided'}
            </p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submit Appeal
          </label>
          <textarea
            value={appealMessage}
            onChange={(e) => setAppealMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Explain why this event should be unblocked..."
          />
          <button
            onClick={handleAppeal}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Appeal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlockModal;