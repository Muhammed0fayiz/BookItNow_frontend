interface BlockEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (duration: string, reason: string) => Promise<void>;
  showTimeInput?: boolean; // Make this optional
}







import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface BlockEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (duration: string, reason: string) => Promise<void>;
  showTimeInput?: boolean; // Make this optional
}const BlockEventModal: React.FC<BlockEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onBlock, 
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [blockReason, setBlockReason] = useState<string>('');
  const [errors, setErrors] = useState<{ duration?: string; reason?: string }>({});

  const blockDurations = [
    { value: '1week', label: '1 Week' },
    { value: '1month', label: '1 Month' },
    { value: '1year', label: '1 Year' },
    { value: '10year', label: '10 Year' }
  ];

  const validate = () => {
    const validationErrors: { duration?: string; reason?: string } = {};
    if (!selectedDuration) {
      validationErrors.duration = 'Please select a block duration.';
    }
    if (!blockReason.trim() || blockReason.trim().length < 5 || blockReason.trim().length > 50) {
      validationErrors.reason = 'Reason must be between 5 and 50 characters.';
    }
    return validationErrors;
  };

  const handleBlock = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onBlock(selectedDuration, blockReason.trim());
      setSelectedDuration(''); 
      setBlockReason(''); 
      setErrors({}); 
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  // Reset state whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedDuration('');
      setBlockReason('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Block Event</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Block Duration</label>
          <div className="grid grid-cols-2 gap-2">
            {blockDurations.map((duration) => (
              <button
                key={duration.value}
                onClick={() => {
                  setSelectedDuration(duration.value);
                  setErrors((prev) => ({ ...prev, duration: undefined }));
                }}
                className={`py-2 px-4 rounded ${
                  selectedDuration === duration.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
          {errors.duration && <p className="text-red-500 text-sm mt-2">{errors.duration}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="blockReason" className="block text-gray-700 mb-2">
            Reason for Blocking
          </label>
          <textarea
            id="blockReason"
            value={blockReason}
            onChange={(e) => {
              setBlockReason(e.target.value);
              setErrors((prev) => ({ ...prev, reason: undefined }));
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter reason for blocking this event..."
          />
          {errors.reason && <p className="text-red-500 text-sm mt-2">{errors.reason}</p>}
        </div>

        <button
          onClick={handleBlock}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Confirm Block
        </button>
      </div>
    </div>
  );
};

export default BlockEventModal;

