'use client'
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';

interface PaymentSuccessProps {
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({}) => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home'); // Navigate to home page after 1 second
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Your booking has been confirmed. Thank you!</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;