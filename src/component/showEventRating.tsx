import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/component/ui/card";
import { Star, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import Image from "next/image";
import axiosInstance from "@/shared/axiousintance";

// Button component remains the same
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "outline" | "ghost"; 
  size?: "default" | "sm"; 
  onClick?: () => void; 
  className?: string;
}) => {
  const baseStyles = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 hover:bg-gray-50",
    ghost: "hover:bg-gray-100"
  };
  
  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

interface Rating {
  _id: string;
  userName: string;
  profilePicture?: string;
  rating: number;
  review: string;
  Date: string;
}

interface EventRatingPageProps {
  eventId: string;
}

const EventRatingPage: React.FC<EventRatingPageProps> = ({ eventId }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchEventRatings = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/userEvent/eventrating/${eventId}`);
        const fetchedRatings = response.data.ratings;
        setRatings(fetchedRatings);

        const totalRating = fetchedRatings.reduce((sum: number, rating: Rating) => sum + rating.rating, 0);
        setAverageRating(fetchedRatings.length > 0 ? totalRating / fetchedRatings.length : 0);
      } catch (err) {
        setError('Failed to fetch ratings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventRatings();
  }, [eventId]);

  // Rest of the component remains the same
  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const sortRatings = (ratings: Rating[]) => {
    return [...ratings].sort((a, b) => {
      const modifier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'date') {
        return modifier * (new Date(b.Date).getTime() - new Date(a.Date).getTime());
      }
      return modifier * (b.rating - a.rating);
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            } transition-colors duration-200`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedRatings = sortRatings(ratings);

  return (
    <div className="container mx-auto px-4 py-8 ">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold mb-6">Event Ratings</h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex flex-col items-start">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600 mt-1">
                {ratings.length} review{ratings.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Button
                variant={sortBy === 'date' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                Date
              </Button>
              <Button
                variant={sortBy === 'rating' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy('rating')}
              >
                Rating
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {ratings.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              No reviews yet for this event.
            </div>
          ) : (
            <div className="space-y-4 ">
              {sortedRatings.map((rating) => (
                <Card key={rating._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                   
                     <Image
  src={rating.profilePicture || '/default-avatar.png'}
  alt={rating.userName}
  width={100}
  height={100}
  className="rounded-full ring-2 ring-gray-200"
/>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{rating.userName}</h3>
                          <span className="text-sm text-gray-600">
                            {new Date(rating.Date).toLocaleDateString()}
                          </span>
                        </div>
                        {renderStars(rating.rating)}
                        <div className={`mt-2 ${expandedReviews.has(rating._id) ? '' : 'line-clamp-3'}`}>
                          <p className="text-gray-700">{rating.review}</p>
                        </div>
                        {rating.review.length > 150 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandReview(rating._id)}
                            className="mt-2"
                          >
                            {expandedReviews.has(rating._id) ? 'Show less' : 'Read more'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRatingPage;