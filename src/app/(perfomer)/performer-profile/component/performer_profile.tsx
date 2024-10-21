'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Mail, MapPin, Star, Music, Edit, Save } from 'lucide-react';
import axiosInstance from '@/shared/axiousintance';

interface PerformerDetails {
  bandName: string;
  email: string;
  place: string;
  rating: number;
  description: string;
  genre: string;
}

const PerformerProfile: React.FC = () => {
  const router = useRouter();
  const [performerDetails, setPerformerDetails] = useState<PerformerDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<PerformerDetails | null>(null);

  useEffect(() => {
    const fetchPerformerDetails = async () => {
      try {
        const token = getCookie('userToken');
        if (token) {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          const userId = decodedPayload.id;
          
          const response = await axiosInstance.get(`/getPerfomer/${userId}`);
          if (response.data) {
            setPerformerDetails(response.data.response);
            setEditedDetails(response.data.response);
          }
        }
      } catch (error) {
        console.error('Failed to fetch performer details:', error);
      }
    };

    fetchPerformerDetails();
  }, []);

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length > 1) return parts[1].split(';')[0];
    return undefined;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Implement the API call to save the edited details
      // await axiosInstance.put(`/updatePerformer/${performerDetails.id}`, editedDetails);
      setPerformerDetails(editedDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update performer details:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDetails(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!performerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
          <h3 className="text-lg leading-6 font-medium">Performer Profile</h3>
          <p className="mt-1 max-w-2xl text-sm">Personal details and information</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserCircle className="mr-2" size={20} /> Band Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="bandName"
                    value={editedDetails?.bandName || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  performerDetails.bandName
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="mr-2" size={20} /> Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedDetails?.email || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  performerDetails.email
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="mr-2" size={20} /> Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="place"
                    value={editedDetails?.place || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  performerDetails.place
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Star className="mr-2" size={20} /> Rating
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {performerDetails.rating} / 5
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Music className="mr-2" size={20} /> Genre
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="genre"
                    value={editedDetails?.genre || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  performerDetails.genre
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedDetails?.description || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                ) : (
                  performerDetails.description
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="mr-2" size={20} /> Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="mr-2" size={20} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformerProfile;