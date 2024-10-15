import React, { useState, useEffect } from 'react';
import axiosInstance from '@/shared/axiousintance'; // Ensure this path is correct

interface UploadEventFormProps {
  onClose: () => void; // Define onClose prop type
}

const UploadEventForm: React.FC<UploadEventFormProps> = ({ onClose }) => {
  const [bandName, setBandName] = useState('');
  const [place, setPlace] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null); // State to store user ID

  // State for error messages
  const [errors, setErrors] = useState({
    bandName: '',
    place: '',
    videoUrl: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    const cookieToken = getCookie('userToken');
    if (cookieToken) {
      try {
        const payload = cookieToken.split('.')[1];
        const user = JSON.parse(atob(payload));
        setUserId(user.id); // Set user ID from the token
      } catch (error) {
        console.error('Failed to parse user token:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      bandName: '',
      place: '',
      videoUrl: '',
      category: '',
      description: '',
    });

    let isValid = true;

    // Frontend validations
    if (!bandName || bandName.length < 2) {
      setErrors((prev) => ({ ...prev, bandName: 'Band Name must be at least 2 letters.' }));
      isValid = false;
    }
    if (!place || place.length < 2) {
      setErrors((prev) => ({ ...prev, place: 'Place must be at least 2 letters.' }));
      isValid = false;
    }
    if (!videoUrl) {
      setErrors((prev) => ({ ...prev, videoUrl: 'Video URL is required.' }));
      isValid = false;
    } else if (!isValidUrl(videoUrl)) {
      setErrors((prev) => ({ ...prev, videoUrl: 'Invalid URL format.' }));
      isValid = false;
    }
    if (!category) {
      setErrors((prev) => ({ ...prev, category: 'Category is required.' }));
      isValid = false;
    }
    if (!description || description.length < 5) {
      setErrors((prev) => ({ ...prev, description: 'Description must be at least 5 letters.' }));
      isValid = false;
    }

    if (!isValid) return; // Stop submission if validation fails

    const tempPerformerData = {
      bandName,
      place,
      videoUrl,
      category,
      description,
      user_id: userId, // Include user ID in the data
    };

    try {
      console.log('hello world');
      console.log(tempPerformerData);
      const response = await axiosInstance.post('/tempPerformer', tempPerformerData);
      console.log('Response:', response.data);
      onClose(); // Optionally close the modal after submission
    } catch (error) {
      console.error('Error uploading event:', error);
    }
  };

  const handleCancel = () => {
    setBandName('');
    setPlace('');
    setVideoUrl('');
    setCategory('');
    setDescription('');
    onClose(); // Close the modal on cancel
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear error for the field being edited
  };

  const isValidUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
      'localhost|' + // localhost
      '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // ipv4
      '\\[?[a-f\\d]{1,4}(:?[a-f\\d]{1,4}){0,7}\\]?)' + // ipv6
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length > 1) {
      return parts[1].split(';')[0];
    }

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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the band name"
          />
          {errors.bandName && <p className="text-red-600 text-sm">{errors.bandName}</p>} {/* Error message with smaller font size */}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Place:</label>
          <input
            type="text"
            value={place}
            onChange={handleChange(setPlace, 'place')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the place"
          />
          {errors.place && <p className="text-red-600 text-sm">{errors.place}</p>} {/* Error message with smaller font size */}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Video URL:</label>
          <input
            type="text"
            value={videoUrl}
            onChange={handleChange(setVideoUrl, 'videoUrl')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the video URL"
          />
          {errors.videoUrl && <p className="text-red-600 text-sm">{errors.videoUrl}</p>} {/* Error message with smaller font size */}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Category:</label>
          <input
            type="text"
            value={category}
            onChange={handleChange(setCategory, 'category')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the category"
          />
          {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>} {/* Error message with smaller font size */}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <textarea
            value={description}
            onChange={handleChange(setDescription, 'description')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter a brief description"
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>} {/* Error message with smaller font size */}
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
