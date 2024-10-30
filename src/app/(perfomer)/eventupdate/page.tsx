'use client'

import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  id: string;
  title: string;
  category: string;
  userId: string;
  price: string;
  teamLeader: string;
  teamLeaderNumber: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

const EventForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    category: '',
    userId: '',
    price: '',
    teamLeader: '',
    teamLeaderNumber: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validateField = (name: keyof FormData, value: string): string => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'title':
        if (!trimmedValue) return 'Event name is required';
        if (trimmedValue.length < 2) return 'Event name must be at least 2 characters';
        if (trimmedValue.length > 15) return 'Event name must be less than 15 characters';
        return '';

      case 'price':
        if (!trimmedValue) return 'Price is required';
        if (isNaN(Number(trimmedValue)) || Number(trimmedValue) < 1000) return 'Price must be at least 1000';
        return '';

      case 'category':
        if (!trimmedValue) return 'Category is required';
        return '';

      case 'teamLeader':
        if (!trimmedValue) return 'Team leader name is required';
        if (trimmedValue.length < 2) return 'Team leader name must be at least 2 characters';
        return '';

      case 'teamLeaderNumber':
        if (!trimmedValue) return 'Contact number is required';
        if (!/^\d{10}$/.test(trimmedValue)) return 'Please enter a valid 10-digit number';
        return '';

      case 'description':
        if (!trimmedValue) return 'Description is required';
        if (trimmedValue.length < 10) return 'Description must be at least 10 characters';
        return '';

      case 'imageUrl':
        if (!trimmedValue) return 'Image URL is required';
        try {
          new URL(trimmedValue);
          return '';
        } catch {
          return 'Please enter a valid URL';
        }

      default:
        return '';
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name as keyof FormData, value)
      }));
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
    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const touchedFields: TouchedFields = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    if (validateForm()) {
      try {
        console.log('Valid form data:', formData);
        setFormData({
          id: '',
          title: '',
          category: '',
          userId: '',
          price: '',
          teamLeader: '',
          teamLeaderNumber: '',
          description: '',
          imageUrl: '',
        });
        setErrors({});
        setTouched({});
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Form has errors');
    }
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-indigo-500 hover:text-indigo-700 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className={labelClasses} htmlFor="title">Event Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("title")}`}
                />
                {errors.title && <p className={errorClasses}>{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelClasses} htmlFor="category">Category</label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("category")}`}
                />
                {errors.category && <p className={errorClasses}>{errors.category}</p>}
              </div>

              {/* Price */}
              <div>
                <label className={labelClasses} htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("price")}`}
                />
                {errors.price && <p className={errorClasses}>{errors.price}</p>}
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              {/* Team Leader */}
              <div>
                <label className={labelClasses} htmlFor="teamLeader">Team Leader</label>
                <input
                  type="text"
                  name="teamLeader"
                  id="teamLeader"
                  value={formData.teamLeader}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("teamLeader")}`}
                />
                {errors.teamLeader && <p className={errorClasses}>{errors.teamLeader}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className={labelClasses} htmlFor="teamLeaderNumber">Contact Number</label>
                <input
                  type="text"
                  name="teamLeaderNumber"
                  id="teamLeaderNumber"
                  value={formData.teamLeaderNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("teamLeaderNumber")}`}
                />
                {errors.teamLeaderNumber && <p className={errorClasses}>{errors.teamLeaderNumber}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className={labelClasses} htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses} ${getInputStateClasses("imageUrl")}`}
                />
                {errors.imageUrl && <p className={errorClasses}>{errors.imageUrl}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses} htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClasses} ${getInputStateClasses("description")}`}
            />
            {errors.description && <p className={errorClasses}>{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
