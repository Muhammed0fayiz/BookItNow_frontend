'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AxiosError } from 'axios';
import axiosInstance from '@/shared/axiousintance';

const OtpPage = () => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [showVerifyButton, setShowVerifyButton] = useState<boolean>(true);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryEmail = searchParams.get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    } else {
      setError('Email not provided in URL. Please check the link and try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setShowVerifyButton(false);
      setShowResendButton(true);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is missing from the URL. Please check the link and try again.');
      return false;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post('/user/verify-otp', { email, otp });
        console.log('OTP verification response:', response.data);
        router.push('/auth');
      } catch (err) {
        handleAxiosError(err, 'OTP verification failed. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is missing. Unable to resend OTP.');
      return;
    }

    setShowResendButton(false);
    setShowVerifyButton(true);
    setTimer(60);
    setOtp('');
    setError('');

    try {
      const response = await axiosInstance.post(`/user/resendotp/${email}`);
      console.log('OTP resent:', response.data);
    } catch (err) {
      handleAxiosError(err, 'Failed to resend OTP. Please try again.');
      setShowResendButton(true);
      setShowVerifyButton(false);
    }
  };

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err instanceof AxiosError) {
      console.error('API Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      console.error('Error:', err.message);
      setError(err.message);
    } else {
      console.error('Unknown error:', err);
      setError(defaultMessage);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-300">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Enter OTP</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {email && <p className="text-gray-600 text-center mb-4">Verifying OTP for: {email}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter 6-digit OTP"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
            required
          />
          {showVerifyButton && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          )}
        </form>

        {showResendButton ? (
          <button
            onClick={handleResendOtp}
            className="w-full mt-4 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-600 text-center mt-4">Resend OTP in {timer} seconds</p>
        )}
      </div>
    </div>
  );
};

export default OtpPage;