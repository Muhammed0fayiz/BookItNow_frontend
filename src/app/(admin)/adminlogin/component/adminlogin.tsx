'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/shared/axiousintance';

interface AdminLoginData {
  email: string;
  password: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean; // Added disabled prop
}

const Button: React.FC<ButtonProps> = ({ type = 'button', className = '', children, onClick, disabled }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded font-semibold text-sm ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled} // Applied disabled
    >
      {children}
    </button>
  );
};

const AdminLogin: React.FC = () => {
  const [adminLoginData, setAdminLoginData] = useState<AdminLoginData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission
  const router = useRouter();


  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get('/admin/checkSession'); // Example endpoint
        if (response.data.isAuthenticated) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };
    checkSession();
  }, [router]);
  const handleAdminLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminLoginData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    if (!adminLoginData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminLoginData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!adminLoginData.password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const adminLoginSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsSubmitting(true); // Disable button while submitting

    try {
      const response = await axiosInstance.post('/admin/adminLogin', adminLoginData);
      if (response.data.success) {
        router.push('/dashboard');
      } else {
        setGeneralError(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else if (error.request) {
        setGeneralError('No response from server. Please try again.');
      } else {
        setGeneralError('An error occurred. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Admin Login</h1>
          <form onSubmit={adminLoginSubmission} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={adminLoginData.email}
                onChange={handleAdminLoginChange}
                placeholder="Email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={adminLoginData.password}
                onChange={handleAdminLoginChange}
                placeholder="Password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
            </div>
            {generalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{generalError}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
