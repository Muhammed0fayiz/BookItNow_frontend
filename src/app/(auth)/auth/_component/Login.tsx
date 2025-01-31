'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Toaster } from 'sonner';
import { loginImage, loginpefomer, signup } from '@/datas/logindatas';
import { SignUpForm } from '@/component/signupForm';
import { UserLoginForm } from '@/component/userLoginform';
import { PerformerLoginForm } from '@/component/performerLoginForm';

const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPerformer, setIsPerformer] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userData = query.get("user");
    const tokenData = query.get("token");

    if (userData && tokenData) {
      const user = JSON.parse(decodeURIComponent(userData));
      document.cookie = `userToken=${decodeURIComponent(tokenData)}; path=/; secure; SameSite=Strict`;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", decodeURIComponent(tokenData));
      router.push("/Home");
    }
  }, [router]);

  const toggleForm = () => setIsSignUp(!isSignUp);
  const toggleRole = () => setIsPerformer(!isPerformer);

  return (
    <div className="container flex items-center justify-center h-screen bg-gradient-to-r from-gray-200 to-blue-300">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden h-[550px]">
        <Toaster />

        <div className="w-1/2 hidden md:block">
          <Image 
            src={isSignUp ? signup.img : isPerformer ? loginpefomer.img : loginImage.img} 
            alt={isSignUp ? "Sign Up Image" : isPerformer ? "Performer Login Image" : "User Login Image"}
            width={500} 
            height={500} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          {isSignUp ? (
            <SignUpForm toggleForm={toggleForm} />
          ) : isPerformer ? (
            <PerformerLoginForm toggleForm={toggleForm} toggleRole={toggleRole} />
          ) : (
            <UserLoginForm toggleForm={toggleForm} toggleRole={toggleRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;