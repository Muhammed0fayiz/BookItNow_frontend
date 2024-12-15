'use client';

import React, { useState, ChangeEvent, FocusEvent, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import usePerformerStore from '@/store/usePerformerStore';
import { useEdgeStore } from '@/lib/edgestore';
import axiosInstance from '@/shared/axiousintance';
import usePerformerEventsStore from '@/store/usePerformerEvents';

interface Event {
    _id?: string;
    title: string;
    category: string;
    price: number;
    teamLeader: string;
    teamLeaderNumber: string;
    rating: number;
    description: string;
    imageUrl: string;
}

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
    const { events, fetchPerformerEvents, setEvents } = usePerformerEventsStore();
    const { performerDetails, fetchPerformerDetails } = usePerformerStore();
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File>();
    const { edgestore } = useEdgeStore();
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);

    // Fetch performer details on component mount
    useEffect(() => {
        fetchPerformerDetails();
    }, [fetchPerformerDetails]);

    // Update form data with user ID when performer details are available
    useEffect(() => {
        if (performerDetails?.userId) {
            setFormData(prev => ({
                ...prev,
                userId: performerDetails.userId,
            }));
        }
    }, [performerDetails]);

    // Fetch performer events
    useEffect(() => {
        fetchPerformerEvents();
    }, [fetchPerformerEvents]);

    // Set form data when event is found
    useEffect(() => {
        if (events.length > 0) {
            const foundEvent = events.find(event => event._id === id);
            setEvent(foundEvent || null);
            if (foundEvent) {
                setFormData(prev => ({
                    ...prev,
                    id: foundEvent._id || '',
                    title: foundEvent.title,
                    category: foundEvent.category,
                    price: foundEvent.price.toString(),
                    teamLeader: foundEvent.teamLeader,
                    teamLeaderNumber: foundEvent.teamLeaderNumber,
                    description: foundEvent.description,
                    imageFile: null,
                }));
                setImagePreview(foundEvent.imageUrl);
            }
        }
    }, [events, id]);

    // Clear success message after 3 seconds
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (submitSuccess) {
            timeout = setTimeout(() => setSubmitSuccess(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [submitSuccess]);

    // Field validation rules
    const validateField = (name: keyof FormData, value: any): string => {
        const validators: Record<keyof FormData, (value: any) => string> = {
            id: () => '',
            userId: () => '',
            title: value => (
                !value ? 'Event name is required' : 
                value.length < 2 ? 'Event name must be at least 2 characters' : 
                value.length > 15 ? 'Event name must be less than 15 characters' : 
                ''
            ),
            price: value => (
                !value ? 'Price is required' : 
                isNaN(Number(value)) ? 'Price must be a number' : 
                Number(value) < 1000 ? 'Price must be at least 1000' : 
                Number(value) > 1000000 ? 'Price cannot exceed 1,000,000' : 
                ''
            ),
            category: value => (!value ? 'Category is required' : ''),
            teamLeader: value => (
                !value ? 'Team leader name is required' : 
                value.length < 2 ? 'Team leader name must be at least 2 characters' : 
                !/^[a-zA-Z\s]*$/.test(value) ? 'Team leader name can only contain letters' : 
                ''
            ),
            teamLeaderNumber: value => (
                !value ? 'Contact number is required' : 
                !/^\d{10}$/.test(value) ? 'Please enter a valid 10-digit number' : 
                ''
            ),
            description: value => (
                !value ? 'Description is required' : 
                value.length < 10 ? 'Description must be at least 10 characters' : 
                value.length > 500 ? 'Description cannot exceed 500 characters' : 
                ''
            ),
            imageFile: () => '',
        };
        return validators[name](value);
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    // Handle image upload
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, imageFile: '' }));
        }
    };

    // Handle input blur (validation)
    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ 
            ...prev, 
            [name]: validateField(name as keyof FormData, value) 
        }));
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;
        
        Object.keys(formData).forEach(key => {
            const error = validateField(
                key as keyof FormData, 
                formData[key as keyof FormData]
            );
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });
        
        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        // Mark all fields as touched
        const touchedFields: TouchedFields = {};
        Object.keys(formData).forEach(key => { 
            touchedFields[key] = true; 
        });
        setTouched(touchedFields);

        if (validateForm()) {
            try {
                // Check if both IDs are available
                if (!id || !performerDetails?.PId) {
                    throw new Error('Missing required IDs');
                }

                const submitFormData = new FormData();

                // Handle image upload
                if (formData.imageFile) {
                    const imageResponse = await edgestore.publicFiles.upload({
                        file: formData.imageFile
                    });
                    if (imageResponse?.url) {
                        submitFormData.append('imageUrl', imageResponse.url);
                    } else {
                        throw new Error("Image upload failed");
                    }
                }

                // Append form data
                Object.entries(formData).forEach(([key, value]) => {
                    if (key !== 'imageFile' && value !== null) {
                        submitFormData.append(key, value.toString());
                    }
                });

                // Add event ID to form data
                submitFormData.append('eventId', id as string);

                // Make API request
                console.log('ffffffffffffffffffffffffff')

                console.log(`${performerDetails.PId}/${id}`,'ffffffffffffffffffayi')
                const response = await axiosInstance.put(
                    `/performer/editEvents/${performerDetails.PId}/${id}`,
                    submitFormData,
                    {withCredentials:true});

                // Reset form and show success message
                setFormData(INITIAL_FORM_STATE);
                setImagePreview(null);
                setErrors({});
                setTouched({});
                setSubmitSuccess(true);
                router.replace('/event-management');
            } catch (error) {
                setSubmitError(
                    error instanceof Error 
                        ? error.message 
                        : 'An error occurred while submitting the form'
                );
                console.error('Error:', error);
            }
        } else {
            setSubmitError('Please correct the errors before submitting');
        }

        setIsSubmitting(false);
    };

    // CSS Classes
    const inputClasses = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    const getInputStateClasses = (fieldName: string): string => {
        if (touched[fieldName]) {
            return errors[fieldName] 
                ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                : "border-green-500 focus:ring-green-500 focus:border-green-500";
        }
        return "border-gray-300";
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <button 
                    onClick={() => router.replace('/event-management')} 
                    className="mb-4 flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    Back to Event Management
                </button>

                <h2 className="text-2xl font-bold mb-4">
                    {event ? 'Update Event' : 'Create New Event'}
                </h2>

                {submitError && (
                    <div className="text-red-500 mb-4">{submitError}</div>
                )}

                {submitSuccess && (
                    <div className="text-green-500 mb-4">
                        Event {event ? 'updated' : 'created'} successfully!
                    </div>
                )}

                <div className="space-y-4">
                    {/* Event Name */}
                    <div>
                        <label className={labelClasses}>Event Name</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('title')}`}
                        />
                        {errors.title && (
                            <div className={errorClasses}>{errors.title}</div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className={labelClasses}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('category')}`}
                        >
                            <option value="">Select Category</option>
                            <option value="Motivational">Motivational</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Music">Music</option>
                        </select>
                        {errors.category && (
                            <div className={errorClasses}>{errors.category}</div>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className={labelClasses}>Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('price')}`}
                        />
                        {errors.price && (
                            <div className={errorClasses}>{errors.price}</div>
                        )}
                    </div>

                    {/* Team Leader */}
                    <div>
                        <label className={labelClasses}>Team Leader Name</label>
                        <input
                            type="text"
                            name="teamLeader"
                            value={formData.teamLeader}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('teamLeader')}`}
                        />
                        {errors.teamLeader && (
                            <div className={errorClasses}>{errors.teamLeader}</div>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className={labelClasses}>Contact Number</label>
                        <input
                            type="text"
                            name="teamLeaderNumber"
                            value={formData.teamLeaderNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('teamLeaderNumber')}`}
                        />
                        {errors.teamLeaderNumber && (
                            <div className={errorClasses}>{errors.teamLeaderNumber}</div>
                        )}
                    </div>
{/* Description */}
<div>
                        <label className={labelClasses}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${getInputStateClasses('description')}`}
                            rows={4}
                        />
                        {errors.description && (
                            <div className={errorClasses}>{errors.description}</div>
                        )}
                    </div>

                    {/* Event Image */}
                    <div>
                        <label className={labelClasses}>Event Image</label>
                        <input
                            type="file"
                            accept="image/*"
                          
                            onChange={handleImageChange}
                            className={`${inputClasses} ${getInputStateClasses('imageFile')}`}
                        />
                        {imagePreview && (
                            <img 
                                src={imagePreview} 
                                alt="Image preview" 
                                className="mt-2 h-32 w-32 object-cover"
                            />
                        )}
                        {errors.imageFile && (
                            <div className={errorClasses}>{errors.imageFile}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="mt-4 w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventForm;