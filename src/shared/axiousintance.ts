
// export const localhost_backend = process.env.NEXT_PUBLIC_SERVER_URL;
export const localhost_backend ='https://api.bookitnow.shop';

import axios from 'axios';
import Cookies from 'js-cookie'; 

const axiosInstance = axios.create({
   baseURL: localhost_backend,
   headers: { "Content-Type": "application/json" },
   withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("userToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);


export const axiosInstanceMultipart = axios.create({
  baseURL: localhost_backend,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
   
      console.error("Unauthorized, redirecting...");
 
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;
