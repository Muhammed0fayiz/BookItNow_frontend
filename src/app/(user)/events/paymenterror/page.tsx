'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentError: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [eventId, setEventId] = useState<string | null>(null);
  const [performerId, setPerformerId] = useState<string | null>(null);

  useEffect(() => {
    setEventId(searchParams.get('eventId'));
    setPerformerId(searchParams.get('performerId'));
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (eventId && performerId) {
        router.replace(`/events/${performerId}/${eventId}`);
      } else {
        router.replace('/events');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [router, eventId, performerId]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <XCircle className="text-red-500 h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600">There was an error processing your payment. Please try again.</p>
      </div>
    </div>
  );
};

const PaymentErrorPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentError />
  </Suspense>
);

export default PaymentErrorPage;