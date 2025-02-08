'use client';
import { AxiosError } from 'axios';
import React, { useState, ChangeEvent, FocusEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePerformerStore from '@/store/usePerformerStore';
import { useEdgeStore } from '@/lib/edgestore';

import { Upload, Calendar,Users, Phone, FileText, Image as ImageIcon } from 'lucide-react';
import Image from "next/image";
import { uploadPEvent } from '@/services/performerEvent';
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
  const { edgestore } = useEdgeStore();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

  const validateField = (name: keyof FormData, value: string | File | null): string => {
    if (name === 'imageFile') {
      if (!value) return 'Image is required';
      return '';
    }
  
    // Type check if the value is a string
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
    const validators: Record<keyof FormData, (value: string | File | null) => string> = {
      id: () => '',
      userId: () => '',
      title: (value) => {
        if (typeof value === 'string') {
          if (!value) return 'Event name is required';
          if (value.length < 2) return 'Event name must be at least 2 characters';
          if (value.length > 15) return 'Event name must be less than 15 characters';
        }
        return '';
      },
      price: (value) => {
        if (typeof value === 'string') { 
          if (!value) return 'Price is required';
          const price = Number(value);
          if (isNaN(price)) return 'Price must be a number';
          if (price < 1000) return 'Price must be at least 1000';
          if (price > 1000000) return 'Price cannot exceed 1,000,000';
        }
        return '';
      },
      category: (value) => (!value ? 'Category is required' : ''),
      teamLeader: (value) => {
        if (typeof value === 'string') { 
          if (!value) return 'Team leader name is required';
          if (value.length < 2) return 'Team leader name must be at least 2 characters';
          if (value.length > 20) return 'Team leader name must be less than 20 characters';
          if (!/^[a-zA-Z\s]*$/.test(value)) return 'Team leader name can only contain letters';
        }
        return '';
      },
      teamLeaderNumber: (value) => {
        if (typeof value === 'string') { 
          if (!value) return 'Contact number is required';
          if (!/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit number';
        }
        return '';
      },
      description: (value) => {
        if (typeof value === 'string') { 
          if (!value) return 'Description is required';
          if (value.length < 10) return 'Description must be at least 10 characters';
          if (value.length > 50) return 'Description cannot exceed 50 characters';
        }
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
  
    // Mark all fields as touched
    const touchedFields: TouchedFields = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as TouchedFields);
  
    setTouched(touchedFields);
  
    if (!validateForm()) {
      setSubmitError('Please correct the errors before submitting');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const submitFormData = new FormData();
  
      // Upload image if exists
      if (formData.imageFile) {
        const imageResponse = await edgestore.publicFiles.upload({
          file: formData.imageFile,
        });
  
        if (!imageResponse?.url) {
          setSubmitError('Image upload failed');
          setIsSubmitting(false);
          return;
        }
  
        submitFormData.append('imageUrl', imageResponse.url);
      }
  
      // Append other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== null) {
          submitFormData.append(key, value.toString());
        }
      });
  
      // Call API service

      await uploadPEvent(performerDetails?.PId as string, submitFormData);
  
      // Reset form state
      setFormData(INITIAL_FORM_STATE);
      setImagePreview(null);
      setErrors({});
      setTouched({});
      setSubmitSuccess(true);
      router.replace('/event-management');
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data) {
        setSubmitError(error.response.data.message || 'An error occurred');
      } else {
        setSubmitError('An error occurred while submitting the form');
      }
      console.error('Error:ddddddddddddd', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8">
      {isImageModalOpen && imagePreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-full h-full p-4 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsImageModalOpen(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            <Image
              src={imagePreview}
              alt="Full size preview"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg p-6 mb-1">
          <button
            onClick={() => router.replace('/event-management')}
            className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Events</span>
          </button>
          
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Event
            </h2>
            <p className="text-gray-500 mt-2">Fill in the details to create your amazing event</p>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-6 space-y-6">
          {submitError && (
            <div className="animate-shake bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="animate-fadeIn bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Event created successfully!</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Event Name
              </label>
              <input
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('title')} 
                           transition-all duration-200 ease-in-out
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter event name"
              />
              {errors.title && <p className="absolute -bottom-5 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                <FileText className="w-4 h-4 inline-block mr-2" />
                Category
              </label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('category')}
                           bg-white transition-all duration-200 ease-in-out
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select a category</option>
                <option value="music">🎵 Music</option>
                <option value="comedy">😄 Comedy</option>
                <option value="motivational">💫 Motivational</option>
                <option value="sports">⚽ Sports</option>
              </select>
              {errors.category && <p className="absolute -bottom-5 text-xs text-red-500">{errors.category}</p>}
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
              <span className="w-4 h-4 inline-block mr-1">₹</span>

                Price
              </label>
              <input
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('price')}
                           transition-all duration-200 ease-in-out
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter price"
              />
              {errors.price && <p className="absolute -bottom-5 text-xs text-red-500">{errors.price}</p>}
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamLeader">
                <Users className="w-4 h-4 inline-block mr-2" />
                Team Leader
              </label>
              <input
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('teamLeader')}
                           transition-all duration-200 ease-in-out
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                type="text"
                name="teamLeader"
                id="teamLeader"
                value={formData.teamLeader}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter team leader name"
              />
              {errors.teamLeader && <p className="absolute -bottom-5 text-xs text-red-500">{errors.teamLeader}</p>}
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamLeaderNumber">
                <Phone className="w-4 h-4 inline-block mr-2" />
                Contact Number
              </label>
              <input
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('teamLeaderNumber')}
                           transition-all duration-200 ease-in-out
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                type="text"
                name="teamLeaderNumber"
                id="teamLeaderNumber"
                value={formData.teamLeaderNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter contact number"
              />
              {errors.teamLeaderNumber && <p className="absolute -bottom-5 text-xs text-red-500">{errors.teamLeaderNumber}</p>}
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                <FileText className="w-4 h-4 inline-block mr-2" />
                Description
              </label>
              <textarea
                className={`w-full px-4 py-3 rounded-lg border ${getInputStateClasses('description')}
                           transition-all duration-200 ease-in-out resize-none
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter event description"
              />
              {errors.description && <p className="absolute -bottom-5 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="imageFile">
                <ImageIcon className="w-4 h-4 inline-block mr-2" />
                Event Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  {!imagePreview && <Upload className="mx-auto h-12 w-12 text-gray-400" />}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="imageFile" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        onBlur={handleBlur}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <div className="relative group rounded-lg overflow-hidden">
                  <Image
              src={imagePreview}
              alt="Preview"
              width={600}
              height={600}
              className="w-full h-[600px] object-contain cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
              priority
            />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsImageModalOpen(true);
                          }}
                          className="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        >
                          View Full Size
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, imageFile: null }));
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Click the image to view in full size
                  </p>
                </div>
              )}
              {errors.imageFile && <p className="mt-2 text-xs text-red-500">{errors.imageFile}</p>}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;