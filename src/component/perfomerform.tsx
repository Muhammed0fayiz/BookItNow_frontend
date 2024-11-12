import React, { useState, useEffect } from 'react';
import { axiosInstanceMultipart } from '@/shared/axiousintance';

interface UploadEventFormProps {
  id?: string; // id is optional
  onClose: () => void;
  handlefetch:any
  
}

interface FormErrors {
  bandName?: string;
  mobileNumber?: string;
  video?: string;
  description?: string;
}

interface FormData {
  bandName: string;
  mobileNumber: string;
  description: string;
  video: File | null;
  user_id: string;
}

const UploadEventForm: React.FC<UploadEventFormProps> = ({ onClose, id = "" , handlefetch}) => {
  const [formData, setFormData] = useState<FormData>({
    bandName: '',
    mobileNumber: '',
    description: '',
    video: null,
    user_id: id,  // Use the id prop directly
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { bandName, mobileNumber, video, description } = formData;

    if (!bandName.trim()) {
      newErrors.bandName = 'Band Name is required.';
    } else if (bandName.trim().length < 2) {
      newErrors.bandName = 'Band Name must be at least 2 characters long.';
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (!isValidMobile(mobileNumber.trim())) {
      newErrors.mobileNumber = 'Invalid mobile number.';
    }

    if (!video) {
      newErrors.video = 'Please upload a video.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const submitFormData = new FormData();
    submitFormData.append('bandName', formData.bandName.trim());
    submitFormData.append('mobileNumber', formData.mobileNumber.trim());
    submitFormData.append('description', formData.description.trim());
    submitFormData.append('user_id', formData.user_id);
    
    if (formData.video) {
      submitFormData.append('video', formData.video);
    }
  
    try {
      const response = await axiosInstanceMultipart.post('/performer/tempPerformer', submitFormData);
      console.log('Response:', response.data);
      handlefetch()
      onClose();
    } catch (error) {
      console.error('Error uploading event:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    setFormData({
      bandName: '',
      mobileNumber: '',
      description: '',
      video: null,
      user_id: formData.user_id, // Preserve user_id
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, video: files[0] }));
      setErrors(prev => ({ ...prev, video: undefined }));
    }
  };

  const isValidMobile = (mobile: string): boolean => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Upload Your Event</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block mb-1">Band Name:</label>
          <input
            type="text"
            value={formData.bandName}
            onChange={handleChange('bandName')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.bandName ? 'border-red-500' : ''
            }`}
            placeholder="Enter the band name"
          />
          {errors.bandName && <p className="text-red-500 text-sm mt-1">{errors.bandName}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Mobile Number:</label>
          <input
            type="text"
            value={formData.mobileNumber}
            onChange={handleChange('mobileNumber')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.mobileNumber ? 'border-red-500' : ''
            }`}
            placeholder="Enter your mobile number"
          />
          {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.video ? 'border-red-500' : ''
            }`}
          />
          {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="Enter a brief description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mr-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Upload Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadEventForm;
