'use client'
import axiosInstance from '@/shared/axiousintance';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

// Function to validate password
export function isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/; // At least 5 characters, 1 uppercase letter, and 1 number
    return passwordRegex.test(password);
}

interface ChangePasswordFormProps {
    onClose: () => void;
    userId: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose, userId }) => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorCurrentPassword, setErrorCurrentPassword] = useState<string | null>(null);
    const [errorNewPassword, setErrorNewPassword] = useState<string | null>(null);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorCurrentPassword(null);
        setErrorNewPassword(null);
        setErrorConfirmPassword(null);

        // Validate current password
        if (!currentPassword) {
            setErrorCurrentPassword('Current password is required.');
            return;
        }

        // Validate new password
        if (!newPassword) {
            setErrorNewPassword('New password is required.');
            return;
        }
        if (!isValidPassword(newPassword)) {
            setErrorNewPassword('New password must be at least 5 characters long, include at least one uppercase letter and one number.');
            return;
        }

        // Validate confirm password
        if (!confirmPassword) {
            setErrorConfirmPassword('Confirm password is required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorConfirmPassword("New password and confirm password don't match.");
            return;
        }

        try {
            const response = await axiosInstance.put(`/changePassword/${userId}`, {
                currentPassword,
                newPassword,
            },{withCredentials:true});

            if (response.data.success) {
                // Immediately close the modal if the password change is successful
                onClose();
            } else {
                setErrorCurrentPassword(response.data.message || 'Failed to change password.');
            }
        } catch (error) {
            setErrorCurrentPassword('Incorrect old password');
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errorCurrentPassword && <div className="text-red-500 text-xs italic mt-1">{errorCurrentPassword}</div>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errorNewPassword && <div className="text-red-500 text-xs italic mt-1">{errorNewPassword}</div>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errorConfirmPassword && <div className="text-red-500 text-xs italic mt-1">{errorConfirmPassword}</div>}
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Change Password
                    </button>
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;