import React, { useState } from 'react';
import { X, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '@/shared/axiousintance';

interface PerformerAppealProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  blockDetails?: {
    reason: string;
    blockedAt: string;
  };
  performerEmail?: string;
}

const PerformerAppeal: React.FC<PerformerAppealProps> = ({
  eventId,
  performerEmail,
  isOpen,
  onClose,
  blockDetails
}) => {
  const [appealMessage, setAppealMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleClose = () => {
    setAppealMessage('');
    setError(null);
    setIsSuccessful(false);
    onClose();
  };

  const handleAppeal = async () => {
    setError(null);

    if (appealMessage.trim().length < 10) {
      setError('Appeal message must be at least 10 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post(`/performerEvent/appealBlockedEvent/${eventId}/${performerEmail}`, {
        appealMessage
      });
      
      setIsSuccessful(true);
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.error('Error submitting appeal:', error);
      setError('Failed to submit appeal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAppealMessage(e.target.value);
    if (error) {
      setError(null);
    }
  };

  if (!isOpen) return null;

  if (isSuccessful) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-green-600">
            Appeal Sent Successfully
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <AlertCircle className="mr-2" /> Event Blocked
          </h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {blockDetails && (
          <div className="mb-4 bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Blocked Until:</strong> {new Date(blockDetails.blockedAt).toLocaleString()}
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
            onChange={handleMessageChange}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Explain why this event should be unblocked..."
          />
          {error && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertTriangle className="mr-2" size={16} />
              {error}
            </div>
          )}
          <button
            onClick={handleAppeal}
            disabled={isSubmitting}
            className={`mt-2 w-full text-white py-2 rounded-lg transition ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformerAppeal;