import { useState, useEffect } from 'react';
import { axiosInstanceMultipart } from '@/shared/axiousintance';

interface UserDetails {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  waitingPermission: boolean;
  profileImage?: string;
  // Add any other fields that your user object contains
}

interface AuthHook {
  userDetails: UserDetails | null;
  loading: boolean;
  error: Error | null;
  logout: () => void;
}

const useAuth = (): AuthHook => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getCookie('userToken');
        if (!token) {
          throw new Error('No token found');
        }

        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;

        const response = await axiosInstanceMultipart.get<{ response: UserDetails }>(`/getUser/${userId}`);
        setUserDetails(response.data.response);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const logout = (): void => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setUserDetails(null);
  };

  return { userDetails, loading, error, logout };
};

export default useAuth;