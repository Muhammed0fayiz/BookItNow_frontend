import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/component/ui/card';

const ReviewDisplay = () => {
  const reviews = [
    {
      userName: 'Muhammed',
      rating: 5,
      review: 'very good',
      Date: '2025-01-14T04:16:37.474Z'
    },
    {
      userName: 'sample',
      rating: 5,
      review: 'good event',
      Date: '2025-01-14T04:27:35.927Z'
    }
  ];

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.map((review, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{review.userName}</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">{review.review}</p>
            <p className="text-sm text-gray-500">{formatDate(review.Date)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewDisplay;