"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from "@/shared/axiousintance";

interface Rating {
  _id: string;
  eventId: string;
  userId: {
    name: string;
    profileImage?: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

const EventRatingPage: React.FC = () => {
  const { id } = useParams();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchEventRatings = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/ratings/event/${id}`);
        
        const fetchedRatings = response.data;
        setRatings(fetchedRatings);

        // Calculate average rating
        const totalRating = fetchedRatings.reduce((sum, rating) => sum + rating.rating, 0);
        setAverageRating(totalRating / fetchedRatings.length);
      } catch (err) {
        setError('Failed to fetch ratings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventRatings();
    }
  }, [id]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Ratings</h1>
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</span>
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-gray-600">
            Based on {ratings.length} review{ratings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {ratings.length === 0 ? (
          <div className="text-center text-gray-600">
            No reviews yet for this event.
          </div>
        ) : (
          <div className="space-y-6">
            {ratings.map((rating) => (
              <div 
                key={rating._id} 
                className="bg-white shadow-md rounded-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={rating.userId.profileImage || '/default-avatar.png'} 
                    alt={rating.userId.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{rating.userId.name}</h3>
                    <div className="flex items-center">
                      {renderStars(rating.rating)}
                      <span className="ml-2 text-gray-600">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{rating.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRatingPage;