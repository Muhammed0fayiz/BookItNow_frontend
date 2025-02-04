import React, { useState, useEffect } from 'react';
import { axiosInstanceMultipart } from '@/shared/axiousintance';
import Image from "next/image";
interface EditProfileFormProps {
  onClose: () => void;
  username: string;
  userID: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose, username, userID }) => {
  const [userName, setUserName] = useState(username);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUserName(username);
  }, [username]);

  const validateUsername = (name: string) => {
    if (name.length < 2) {
      return 'Username must be at least 2 characters long.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationError = validateUsername(userName);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', userName);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const apiEndpoint = `/updateUserProfile/${userID}`;
      const response = await axiosInstanceMultipart.put(apiEndpoint, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
 
      
      console.log('Profile updated successfully', response.data);
   
      onClose();
   
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUserName(username);
    setProfilePic(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
      <label className="mb-2 ml-2">Username:</label>

      <input
        type="text"
        name="username"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
          setError(null);
        }}
        className={`border rounded p-2 mb-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Enter your username"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <label className="mb-2 ml-2">Profile Picture:</label>
      <input
        type="file"
        name="profilePic"
        accept="image/*"
        onChange={handleImageChange}
        className="border rounded p-2 mb-4"
      />
      {imagePreview && (
       <div className="mt-2 flex justify-center">
       <Image 
         src={imagePreview} 
         width={500}
         height={300}
         alt="Profile Preview" 
         className="w-32 h-32 object-cover rounded" 
       />
     </div>
     
      )}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 "
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
