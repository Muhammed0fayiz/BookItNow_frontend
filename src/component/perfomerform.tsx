import React, { useState, useEffect } from 'react';
import  { axiosInstanceMultipart } from '@/shared/axiousintance'; // Ensure this path is correct

interface UploadEventFormProps {
  onClose: () => void;
}

interface FormErrors {
  bandName?: string;
  mobileNumber?: string;
  video?: string;
  description?: string;
}

const UploadEventForm: React.FC<UploadEventFormProps> = ({ onClose }) => {
  const [bandName, setBandName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const cookieToken = getCookie('userToken');
    if (cookieToken) {
      try {
        const payload = cookieToken.split('.')[1];
        const user = JSON.parse(atob(payload));
        setUserId(user.id);
      } catch (error) {
        console.error('Failed to parse user token:', error);
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
  
    const formData = new FormData();
    formData.append('bandName', bandName.trim());
    formData.append('mobileNumber', mobileNumber.trim());
    if (video) {
      formData.append('video', video);
    }
    formData.append('description', description.trim());
    formData.append('user_id', userId || '');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await axiosInstanceMultipart.post('/tempPerformer', formData);
      console.log('Response:', response.data);
      onClose();
    } catch (error) {
      console.error('Error uploading event:', error);
    }
  };
  
  const handleCancel = () => {
    setBandName('');
    setMobileNumber('');
    setVideo(null);
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideo(e.target.files[0]);
      setErrors(prev => ({ ...prev, video: undefined }));
    }
  };

  const isValidMobile = (mobile: string) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length > 1) return parts[1].split(';')[0];
    return undefined;
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Upload Your Event</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block mb-1">Band Name:</label>
          <input
            type="text"
            value={bandName}
            onChange={handleChange(setBandName, 'bandName')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${errors.bandName ? 'border-red-500' : ''}`}
            placeholder="Enter the band name"
          />
          {errors.bandName && <p className="text-red-500 text-sm mt-1">{errors.bandName}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Mobile Number:</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={handleChange(setMobileNumber, 'mobileNumber')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${errors.mobileNumber ? 'border-red-500' : ''}`}
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
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${errors.video ? 'border-red-500' : ''}`}
          />
          {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <textarea
            value={description}
            onChange={handleChange(setDescription, 'description')}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 ${errors.description ? 'border-red-500' : ''}`}
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