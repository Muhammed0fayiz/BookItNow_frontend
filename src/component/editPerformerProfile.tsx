import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle } from 'lucide-react';
// import { Camera, X, Upload, CheckCircle } from 'lucide-react';
import Image from "next/image";
import { useEdgeStore } from '@/lib/edgestore';
import { updatePerformerProfile } from '@/services/performer';

interface PerformerDetails {
  userId?: string;
  bandName: string;
  place: string;
  mobileNumber: string;
  image: string;
  PId: string;
}

interface EditPerformerProfileFormProps {
  performerDetails: PerformerDetails | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPerformerProfileForm: React.FC<EditPerformerProfileFormProps> = ({
  performerDetails,
  // onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    bandName: performerDetails?.bandName || '',
    place: performerDetails?.place || '',
    mobileNumber: performerDetails?.mobileNumber || '',
    image: performerDetails?.image || '',
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInfo, setImageInfo] = useState<{ size: string; status: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (performerDetails) {
      setFormData({
        bandName: performerDetails.bandName,
        place: performerDetails.place,
        mobileNumber: performerDetails.mobileNumber,
        image: performerDetails.image,
      });
      setImagePreview(performerDetails.image);
    }
  }, [performerDetails]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'bandName':
        return value.length < 2 ? 'Band name must be at least 2 characters long' : '';
      case 'mobileNumber':
        return !value.match(/^\d{10}$/) ? 'Mobile number must be 10 digits' : '';
      case 'place':
        return value.length < 2 ? 'Place must be at least 2 characters long' : '';
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image(); // Fixed Image constructor
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 800;
          
          if (width > height && width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const handleImageChange = async (file: File) => {
    if (file) {
      const originalSize = formatFileSize(file.size);
      setImageInfo({ size: originalSize, status: 'Processing...' });

      if (file.size > 5 * 1024 * 1024) {
        try {
          const resizedFile = await resizeImage(file);
          const newSize = formatFileSize(resizedFile.size);
          setProfilePic(resizedFile);
          setImagePreview(URL.createObjectURL(resizedFile));
          setImageInfo({
            size: `Reduced from ${originalSize} to ${newSize}`,
            status: 'success'
          });
          setErrors(prev => ({ ...prev, image: '' }));
        } catch (error) {
          setErrors(prev => ({
            ...prev,
            image: 'Failed to process image. Please try another.'
          }));
        }
      } else {
        setProfilePic(file);
        setImagePreview(URL.createObjectURL(file));
        setImageInfo({
          size: `Size: ${originalSize}`,
          status: 'success'
        });
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageChange(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageChange(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (key !== "image") {
        const error = validateField(key, formData[key]); // ✅ No error now
        if (error) newErrors[key] = error;
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      let imageUrl: string = formData.image || "";
  
      if (profilePic) {
        const imageResponse = await edgestore.publicFiles.upload({ file: profilePic });
  
        if (!imageResponse?.url) {
          throw new Error("Image upload failed");
        }
  
        imageUrl = imageResponse.url;
      }
  

  
      // Call the API service
      const data = await updatePerformerProfile(performerDetails?.userId as string, formData, imageUrl);
  
      if (data.message === "Profile updated successfully") {
        onSuccess();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update profile. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl shadow-2xl max-w-2xl mx-auto p-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Edit Performer Profile
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div> */}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {/* <label className="block text-lg font-medium text-gray-700">Profile Picture</label> */}
          <div
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
              ${imagePreview ? 'bg-gray-50' : 'bg-white'}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative group">
                <Image
                  src={imagePreview}
                  width={500}
                  height={300}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="p-2 bg-black bg-opacity-50 rounded-full cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center space-y-4 cursor-pointer">
                <Upload className="w-12 h-12 text-blue-500" />
                <span className="text-sm text-gray-500">
                  Drag & drop an image or click to browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </label>
            )}
            
            {imageInfo && (
              <div className="mt-4 flex items-center space-x-2 text-sm">
                {imageInfo.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                <span className={imageInfo.status === 'success' ? 'text-green-600' : 'text-blue-600'}>
                  {imageInfo.size}
                </span>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Band Name</label>
            <input
              type="text"
              name="bandName"
              value={formData.bandName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 
                ${errors.bandName ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter your band name"
            />
            {errors.bandName && (
              <p className="text-sm text-red-500">{errors.bandName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.place ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter your location"
            />
            {errors.place && (
              <p className="text-sm text-red-500">{errors.place}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter your mobile number"
            />
            {errors.mobileNumber && (
              <p className="text-sm text-red-500">{errors.mobileNumber}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 focus:ring-4 focus:ring-blue-200 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </span>
            ) : (
              'Update Profile'
            )}
          </button>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditPerformerProfileForm;