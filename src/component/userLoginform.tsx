// UserLoginForm.tsx
import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from "axios";

import { userLogin } from '@/services/user';

interface UserLoginFormProps {
  toggleForm: () => void;
  toggleRole: () => void;
}

export const UserLoginForm: React.FC<UserLoginFormProps> = ({ toggleForm, toggleRole }) => {
  const router = useRouter();
  const [userLoginData, setUserLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleUserLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLoginData((prev) => ({ ...prev, [name]: value }));
    setLoginErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLoginForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!userLoginData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userLoginData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!userLoginData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setLoginErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateLoginForm()) {
      try {
        const response = await userLogin(userLoginData);
        
        if (response?.token) {
          document.cookie = `userToken=${response.token}; path=/; secure;`;
          toast.success('Login successful!');
          router.replace('/home');
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Login failed");
        }
      }
      
    }
  };

  const handleGoogle = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="form-container">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In as User</h1>
      <input 
        type="email" 
        name="email" 
        value={userLoginData.email} 
        onChange={handleUserLoginChange} 
        placeholder="Email" 
        className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none"
      />
      {loginErrors.email && <p className="text-red-500 mb-2 text-sm">{loginErrors.email}</p>}

      <div className="relative w-full mb-4">
        <input 
          type={showPassword ? "text" : "password"}
          name="password" 
          value={userLoginData.password} 
          onChange={handleUserLoginChange} 
          placeholder="Password" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none pr-10"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
           className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 flex items-center"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {loginErrors.password && <p className="text-red-500 mb-2 text-sm">{loginErrors.password}</p>}
              
      <button 
        onClick={handleLogin} 
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Log In
      </button>

      <button
        className="w-full bg-red-600 text-white py-2 mt-4 rounded-md hover:bg-red-700"
        onClick={handleGoogle}
      >
        Log In with Google
      </button>

      <p className="text-center mt-4">
  Don&apos;t have an account? 
  <button onClick={toggleForm} className="text-blue-600 hover:underline ml-1">
    Sign Up
  </button>
</p>

              
      <div className="text-center mt-4">
        <button onClick={toggleRole} className="text-sm text-gray-700 hover:underline">
          Switch to Performer Login
        </button>
      </div>
    </div>
  );
};
