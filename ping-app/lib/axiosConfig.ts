import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ping-y3wz.onrender.com');

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

export default axiosInstance;