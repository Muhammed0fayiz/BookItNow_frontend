
'use client';


import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
// import GoogleProvider from "next-auth/providers/google";
import { loginImage, loginpefomer, signup } from '@/datas/logindatas';
import axiosInstance from '@/shared/axiousintance';
// import { auth } from '../firebase/firebase';
// import {signinWithPopup,GoogleAuthProvider} from '../firebase/firebas/auth'
const LoginSignup: React.FC = () => {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [emailexisterror, setemailexisterror] = useState<boolean>(false);
  const [isPerformer, setIsPerformer] = useState<boolean>(false);
  const [userLoginData, setUserLoginData] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [performerLoginData, setPerformerLoginData] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState<{ fullName: string; email: string; password: string; confirmPassword: string }>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{ fullName: string; email: string; password: string; confirmPassword: string }>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [loginErrors, setLoginErrors] = useState<{ email: string; password: string }>({ email: '', password: '' });



// const googleAuth=new GoogleAuthProvider()
// const googleLogin=async()=>{
//   const result=await signinWithPopup(auth,googleAuth)
// }

const handleUserLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setUserLoginData((prev) => ({ ...prev, [name]: value }));
  setLoginErrors(prev => ({ ...prev, [name]: '' }));
};

const handlePerformerLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setPerformerLoginData((prev) => ({ ...prev, [name]: value }));
  setLoginErrors(prev => ({ ...prev, [name]: '' }));
};


const validateLoginForm = (): boolean => {
  const newErrors = { email: '', password: '' };
  let isValid = true;

  const data = isPerformer ? performerLoginData : userLoginData;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email) {
    newErrors.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(data.email)) {
    newErrors.email = 'Invalid email format';
    isValid = false;
  }

  if (!data.password) {
    newErrors.password = 'Password is required';
    isValid = false;
  }

  setLoginErrors(newErrors);
  return isValid;
};


  const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    switch (name) {
      case 'fullName':
        if (value.length >= 3) {
          setErrors((prev) => ({ ...prev, fullName: '' }));
        } else {
          setErrors((prev) => ({ ...prev, fullName: 'Full Name must be at least 3 characters' }));
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          setErrors((prev) => ({ ...prev, email: '' }));
        } else {
          setErrors((prev) => ({ ...prev, email: 'Email format is invalid' }));
        }
        break;
      case 'password':
        if (isValidPassword(value)) {
          setErrors((prev) => ({ ...prev, password: '' }));
        } else {
          setErrors((prev) => ({ ...prev, password: 'Password must be at least 5 characters, contain at least one uppercase letter and one number' }));
        }
        break;
      case 'confirmPassword':
        if (value === signUpData.password) {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        }
        break;
    }
  };

  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (isSignUp) {
      if (signUpData.fullName.length < 3) {
        newErrors.fullName = 'Full Name must be at least 3 characters';
        isValid = false;
      }

      if (signUpData.email === '') {
        newErrors.email = 'Email is required';
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signUpData.email)) {
          newErrors.email = 'Email format is invalid';
          isValid = false;
        }
      }

      if (!isValidPassword(signUpData.password)) {
        newErrors.password = 'Password must be at least 5 characters, contain at least one uppercase letter and one number';
        isValid = false;
      }

      if (signUpData.confirmPassword === '') {
        newErrors.confirmPassword = 'Confirm Password is required';
        isValid = false;
      } else if (signUpData.password !== signUpData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    if (!isSignUp) {
      setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
      setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });
    } else {
      if (isPerformer) {
        setPerformerLoginData({ email: '', password: '' });
      } else {
        setUserLoginData({ email: '', password: '' });
      }
    }
  };

  const toggleRole = () => {
    setIsPerformer(!isPerformer);
    if (isSignUp) {
      setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
      setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });
    } else {
      if (isPerformer) {
        setPerformerLoginData({ email: '', password: '' });
      } else {
        setUserLoginData({ email: '', password: '' });
      }
    }
  };

  const signupSubmission = async () => {
    if (validateForm()) {
      const loadingToast = toast.loading('Signing up...');
      try {
        const response = await axiosInstance.post('/signup', signUpData);
        toast.dismiss(loadingToast);
        toast.success('Sign up successful! Redirecting to OTP page...');
        
        // Delay before redirecting
        setTimeout(() => {
          router.push(`/otp?email=${signUpData.email}`);
        }, 2000);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          toast.dismiss(loadingToast);
          setemailexisterror(error.response.data.message);
  
          setTimeout(() => {
            setemailexisterror(false);
          }, 3000);
        } else {
          toast.error('An error occurred during sign up. Please try again.');
          console.error('An error occurred:', error);
        }
      }
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };
  const userLogin = async () => {
    if (validateLoginForm()) {
      const loadingToast = toast.loading('Logging in...');
      try {
        const response = await axiosInstance.post('/userlogin', userLoginData);
        toast.dismiss(loadingToast);
  
        if (response.data && response.data.token) {
          document.cookie = `userToken=${response.data.token}; path=/; secure;`;
          toast.success('Login successful!');
          router.replace ('/home');
        } else {
          toast.error('Login successful, but no token received.');
        }
      } catch (error: any) {
        toast.dismiss(loadingToast);
        if (error.response && error.response.status === 401) {
          toast.error('Invalid email or password');
        } else {
          toast.error('An error occurred during login. Please try again.');
          console.error('An error occurred:', error);
        }
      }
    }
  };
  
  const performerLogin = async () => {
    if (validateLoginForm()) {
      const loadingToast = toast.loading('Logging in...');
      try {
        const response = await axiosInstance.post('/performerlogin', performerLoginData);
        toast.dismiss(loadingToast);
  
        if (response.data && response.data.token) {
          document.cookie = `userToken=${response.data.token}; path=/; secure;`;
          toast.success('Login successful!');
          router.replace ('/performer-dashboard');
        } else {
          toast.error('Login successful, but no token received.');
        }
      } catch (error: any) {
        toast.dismiss(loadingToast);
        if (error.response && error.response.status === 401) {
          toast.error('Invalid email or password');
        } else {
          toast.error('An error occurred during login. Please try again.');
          console.error('An error occurred:', error);
        }
      }
    }
  };





  return (
    <div className="container flex items-center justify-center h-screen bg-gradient-to-r from-gray-200 to-blue-300">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <Toaster />

        {/* Left Side - Image */}
        <div className="w-1/2 hidden md:block">
          {isSignUp ? (
            <Image src={signup.img} alt="Sign Up Image" width={500} height={500} className="w-full h-full object-cover" />
          ) : isPerformer ? (
            <Image src={loginpefomer.img} alt="Performer Login Image" width={500} height={500} className="w-full h-full object-cover" />
          ) : (
            <Image src={loginImage.img} alt="User Login Image" width={500} height={500} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          {isSignUp ? (
            <div className="form-container">
              <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
              <input 
                type="text" 
                name="fullName" 
                value={signUpData.fullName} 
                onChange={handleSignUpChange} 
                placeholder="Full Name" 
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.fullName && <p className="text-red-500 mb-2">{errors.fullName}</p>}
              
              <input 
                type="email" 
                name="email" 
                value={signUpData.email} 
                onChange={handleSignUpChange} 
                placeholder="Email" 
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}
              
              <input 
                type="password" 
                name="password" 
                value={signUpData.password} 
                onChange={handleSignUpChange} 
                placeholder="Password" 
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}
              
              <input 
                type="password" 
                name="confirmPassword" 
                value={signUpData.confirmPassword} 
                onChange={handleSignUpChange} 
                placeholder="Confirm Password" 
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword}</p>}
              
              <h1 className="text-red-600 font-semibold text-lg">{emailexisterror ? emailexisterror : ""}</h1>

              <button onClick={signupSubmission} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Sign Up</button>
              <p className="text-center mt-4">Already have an account? <button onClick={toggleForm} className="text-blue-600 hover:underline">Sign In</button></p>
            </div>
          ) : (
            <div className="form-container">
              <h1 className="text-3xl font-bold mb-6 text-center">{isPerformer ? 'Sign In as Performer' : 'Sign In as User'}</h1>
              <input 
  type="email" 
  name="email" 
  value={isPerformer ? performerLoginData.email : userLoginData.email} 
  onChange={isPerformer ? handlePerformerLoginChange : handleUserLoginChange} 
  placeholder="Email" 
  className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none"
/>
{loginErrors.email && <p className="text-red-500 mb-2 text-sm">{loginErrors.email}</p>}

<input 
  type="password" 
  name="password" 
  value={isPerformer ? performerLoginData.password : userLoginData.password} 
  onChange={isPerformer ? handlePerformerLoginChange : handleUserLoginChange} 
  placeholder="Password" 
  className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none"
/>
{loginErrors.password && <p className="text-red-500 mb-2 text-sm">{loginErrors.password}</p>}
              
              <button onClick={isPerformer ? performerLogin : userLogin} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Log In</button>

              {!isPerformer && (
    <button
      // onClick={googleLogin}
      className="w-full bg-red-600 text-white py-2 mt-4 rounded-md hover:bg-red-700"
    >
      Log In with Google
    </button>
  )}

              <p className="text-center mt-4">Don't have an account? <button onClick={toggleForm} className="text-blue-600 hover:underline">Sign Up</button></p>
              
              <div className="text-center mt-4">
                <button onClick={toggleRole} className="text-sm text-gray-700 hover:underline">{isPerformer ? 'Switch to User Login' : 'Switch to Performer Login'}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .form-container {
          height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    
    </div>
  );
};

export default LoginSignup;
