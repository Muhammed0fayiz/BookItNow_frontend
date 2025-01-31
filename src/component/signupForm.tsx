import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import * as yup from 'yup';
import axiosInstance from '@/shared/axiousintance';

interface SignUpFormProps {
  toggleForm: () => void;
}

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = {
  [key in keyof SignUpData]?: string;
};

// Define validation schema
const signUpSchema = yup.object().shape({
    fullName: yup
      .string()
      .min(3, 'Full Name must be at least 3 characters')
      .matches(/^\S*$/, 'Full Name should not contain spaces')
      .required('Full Name is required'),
    email: yup
      .string()
      .email('Email format is invalid')
      .matches(/^\S*$/, 'Email should not contain spaces')
      .required('Email is required'),
    password: yup
      .string()
      .min(5, 'Password must be at least 5 characters')
      .matches(/^\S*$/, 'Password should not contain spaces')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter and one number'
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .matches(/^\S*$/, 'Confirm Password should not contain spaces')
      .required('Please confirm your password')
  });

export const SignUpForm: React.FC<SignUpFormProps> = ({ toggleForm }) => {
  const router = useRouter();
  const [emailexisterror, setemailexisterror] = useState<string | false>(false);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));

    try {
      // Get the validation schema for this field
      const fieldSchema = yup.reach(signUpSchema, name) as yup.Schema<any>;
      await fieldSchema.validate(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await signUpSchema.validate(signUpData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof SignUpData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const signupSubmission = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const loadingToast = toast.loading('Signing up...');
      try {
        const response = await axiosInstance.post('/signup', signUpData);
        toast.dismiss(loadingToast);
        toast.success('Sign up successful! Redirecting to OTP page...');
        setTimeout(() => {
          router.push(`/otp?email=${signUpData.email}`);
        }, 2000);
      } catch (error: any) {
        toast.dismiss(loadingToast);
        if (error.response?.status === 401) {
          setemailexisterror(error.response.data.message);
          setTimeout(() => setemailexisterror(false), 3000);
        } else {
          toast.error('An error occurred during sign up.');
        }
      }
    }
  };

  return (
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
      
      <div className="relative w-full mb-4">
  <input 
    type={showPassword ? "text" : "password"}
    name="password" 
    value={signUpData.password} 
    onChange={handleSignUpChange} 
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
      {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}
      
      <div className="relative w-full mb-4">
        <input 
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword" 
          value={signUpData.confirmPassword} 
          onChange={handleSignUpChange} 
          placeholder="Confirm Password" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none pr-10"
        />
        <button 
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 flex items-center"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword}</p>}
      
      {emailexisterror && <h1 className="text-red-600 font-semibold text-lg">{emailexisterror}</h1>}

      <button 
        onClick={signupSubmission} 
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Sign Up
      </button>
      
      <p className="text-center mt-4">
        Already have an account? 
        <button onClick={toggleForm} className="text-blue-600 hover:underline ml-1">
          Sign In
        </button>
      </p>
    </div>
  );
};