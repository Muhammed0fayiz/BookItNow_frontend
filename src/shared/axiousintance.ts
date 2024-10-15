import axios from "axios";

export const localhost_backend = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: localhost_backend,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosInstanceMultipart = axios.create({
  baseURL: localhost_backend,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

export default axiosInstance;





// import axios from "axios";

// // Backend URL
// export const localhost_backend = "http://localhost:5000";

// // Token storage example (could be localStorage, sessionStorage, etc.)
// let accessToken = localStorage.getItem("accessToken");
// let refreshToken = localStorage.getItem("refreshToken");

// // Create Axios instance
// const axiosInstance = axios.create({
//   baseURL: localhost_backend,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // Axios instance for multipart form data
// export const axiosInstanceMultipart = axios.create({
//   baseURL: localhost_backend,
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
//   withCredentials: true,
// });

// // Function to refresh tokens
// const refreshAuthToken = async () => {
//   try {
//     const response = await axios.post(`${localhost_backend}/auth/refresh`, {
//       token: refreshToken, // send refresh token
//     });

//     // Update the tokens
//     accessToken = response.data.accessToken;
//     refreshToken = response.data.refreshToken;
    
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);

//     return accessToken;
//   } catch (error) {
//     console.error("Failed to refresh token", error);
//     throw error;
//   }
// };

// // Axios request interceptor to add access token to headers
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Axios response interceptor to handle token expiration and refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If token is expired, refresh it
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newAccessToken = await refreshAuthToken();
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         // Retry the original request with the new access token
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Handle refresh failure (e.g., logout the user)
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // AbortController utility to cancel requests
// export const createAbortController = () => {
//   const controller = new AbortController();
//   return controller;
// };

// // Example of how to use AbortController in a request
// export const fetchDataWithAbort = async () => {
//   const controller = createAbortController();
//   try {
//     const response = await axiosInstance.get("/some-endpoint", {
//       signal: controller.signal,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isCancel(error)) {
//       console.log("Request canceled:", error.message);
//     } else {
//       console.error("Error:", error);
//     }
//   }
//   // Cancel the request if needed
//   controller.abort();
// };

// export default axiosInstance;
