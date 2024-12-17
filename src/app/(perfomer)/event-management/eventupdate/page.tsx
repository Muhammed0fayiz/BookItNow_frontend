'use client';

import React, { useState, ChangeEvent, FocusEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { axiosInstanceMultipart } from '@/shared/axiousintance';

import usePerformerStore from '@/store/usePerformerStore';
import { useEdgeStore } from '@/lib/edgestore';
import axiosInstance from '@/shared/axiousintance';


interface FormData {
  id: string;
  title: string;
  category: string;
  userId: string;
  price: string;
  teamLeader: string;
  teamLeaderNumber: string;
  description: string;
  imageFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

const INITIAL_FORM_STATE: FormData = {
  id: '',
  title: '',
  category: '',
  userId: '',
  price: '',
  teamLeader: '',
  teamLeaderNumber: '',
  description: '',
  imageFile: null,
};

const EventForm: React.FC = () => {
  const router = useRouter();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  useEffect(() => {
    fetchPerformerDetails();
  }, [fetchPerformerDetails]);

  useEffect(() => {
    if (performerDetails?.userId) {
      setFormData(prev => ({
        ...prev,
        userId: performerDetails.userId
      }));
    }
  }, [performerDetails]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (submitSuccess) {
      timeout = setTimeout(() => setSubmitSuccess(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [submitSuccess]);

  const validateField = (name: keyof FormData, value: any): string => {
    if (name === 'imageFile') {
      if (!value) return 'Image is required';
      return '';
    }

    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    const validators: Record<keyof FormData, (value: any) => string> = {
      id: () => '',
      userId: () => '',
      title: (value) => {
        if (!value) return 'Event name is required';
        if (value.length < 2) return 'Event name must be at least 2 characters';
        if (value.length > 15) return 'Event name must be less than 15 characters';
        return '';
      },
      price: (value) => {
        if (!value) return 'Price is required';
        const price = Number(value);
        if (isNaN(price)) return 'Price must be a number';
        if (price < 1000) return 'Price must be at least 1000';
        if (price > 1000000) return 'Price cannot exceed 1,000,000';
        return '';
      },
      category: (value) => !value ? 'Category is required' : '',
      teamLeader: (value) => {
        if (!value) return 'Team leader name is required';
        if (value.length < 2) return 'Team leader name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Team leader name can only contain letters';
        return '';
      },
      teamLeaderNumber: (value) => {
        if (!value) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit number';
        return '';
      },
      description: (value) => {
        if (!value) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 500) return 'Description cannot exceed 500 characters';
        return '';
      },
      imageFile: () => '',
    };

    return validators[name](trimmedValue);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError('');

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name as keyof FormData, value)
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(e.target.files?.[0]);
      setFormData(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, imageFile: '' }));
    }
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof FormData, value)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
  
    const touchedFields: TouchedFields = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);
  
    if (validateForm()) {
      try {
        const submitFormData = new FormData();
  
        // Step 1: Upload Image to Edge Store
        if (formData.imageFile) {
          const imageResponse = await edgestore.publicFiles.upload({
            // file,
            // path: `images/events/${formData.imageFile.name}`,
            file: formData.imageFile,
          });
  
          if (imageResponse?.url) {
            // Store the image URL in the form data to be sent to your API
            submitFormData.append('imageUrl', imageResponse.url);
          } else {
            setSubmitError("Image upload failed");
            return;
          }
        }
  
        // Step 2: Append other form fields to submitFormData
      
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'imageFile' && value !== null) {
            submitFormData.append(key, value.toString());
          }
        });
  
        // Step 3: Send data to the backend API
         console.log('data',submitFormData)
        const response = await axiosInstance.post(
          `/performer/uploadEvents/${performerDetails?.PId}`,
          submitFormData
         
        );
  console.log('res',response)
        // Reset form and show success
        setFormData(INITIAL_FORM_STATE);
        setImagePreview(null);
        setErrors({});
        setTouched({});
        setSubmitSuccess(true);
        router.replace('/event-management');
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
        console.error('Error:', error);
      }
    } else {
      setSubmitError('Please correct the errors before submitting');
    }
  
    setIsSubmitting(false);
  };
  

  const inputClasses = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";

  const getInputStateClasses = (fieldName: string): string => {
    if (touched[fieldName]) {
      if (errors[fieldName]) {
        return "border-red-500 focus:ring-red-500 focus:border-red-500";
      }
      return "border-green-500 focus:ring-green-500 focus:border-green-500";
    }
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => router.replace('/event-management')}
          className="mb-4 flex items-center gap-2 text-indigo-500 hover:text-indigo-700 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Create New Event</h2>

        {submitError && (
          <div className="mb-6 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 p-4 text-green-500 bg-green-50 rounded-lg border border-green-200">
            Event created successfully!
          </div>
        )}

        <div>
          <div className="mb-4">
            <label className={labelClasses} htmlFor="title">Event Name</label>
            <input
              className={`${inputClasses} ${getInputStateClasses('title')}`}
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
             
            />
            {errors.title && <p className={errorClasses}>{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="category">Category</label>
            <select
              className={`${inputClasses} ${getInputStateClasses('category')}`}
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
          
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="comedy">Comedy</option>
              <option value="motivational">Motivational</option>
              <option value="sports">Sports</option>
            </select>
            {errors.category && <p className={errorClasses}>{errors.category}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="price">Price</label>
            <input
              className={`${inputClasses} ${getInputStateClasses('price')}`}
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
         
            />
            {errors.price && <p className={errorClasses}>{errors.price}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="teamLeader">Team Leader Name</label>
            <input
              className={`${inputClasses} ${getInputStateClasses('teamLeader')}`}
              type="text"
              name="teamLeader"
              id="teamLeader"
              value={formData.teamLeader}
              onChange={handleChange}
              onBlur={handleBlur}
             
            />
            {errors.teamLeader && <p className={errorClasses}>{errors.teamLeader}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="teamLeaderNumber">Contact Number</label>
            <input
              className={`${inputClasses} ${getInputStateClasses('teamLeaderNumber')}`}
              type="text"
              name="teamLeaderNumber"
              id="teamLeaderNumber"
              value={formData.teamLeaderNumber}
              onChange={handleChange}
              onBlur={handleBlur}
             
            />
            {errors.teamLeaderNumber && <p className={errorClasses}>{errors.teamLeaderNumber}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="description">Description</label>
            <textarea
              className={`${inputClasses} ${getInputStateClasses('description')}`}
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
          
            ></textarea>
            {errors.description && <p className={errorClasses}>{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClasses} htmlFor="imageFile">Event Image</label>
            <input
              className={`${inputClasses} ${getInputStateClasses('imageFile')}`}
              type="file"
              name="imageFile"
              id="imageFile"
              onChange={handleImageChange}
              onBlur={handleBlur}
           
            />
            {errors.imageFile && <p className={errorClasses}>{errors.imageFile}</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-auto rounded-lg border border-gray-300"
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;