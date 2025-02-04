import { LoginCredentials } from './../types/user';
import axiosInstance from '@/shared/axiousintance';



export const userLogin = async (loginData: LoginCredentials) => {
  try {
    const response = await axiosInstance.post('/userlogin', loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};