import React, { useState } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void; // Changed review to be required
  eventTitle: string;
  id: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventTitle,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
  
    if (!rating) {
      setError('Please select a rating.');
      return;
    }

    if (!review || review.trim().length < 5) {
      setError('Please provide a detailed review (minimum 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
     
      await onSubmit(rating, review.trim());
      onClose();
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Rate Event: {eventTitle}
        </h2>

        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`fas fa-star cursor-pointer ${
                star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <textarea
          placeholder="Write a review (required)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full border rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
          required
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-all duration-300`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default RatingModal;