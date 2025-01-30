import axios from 'axios';

const localURL = 'http://localhost:5000';
const hostedURL = 'https://ping-y3wz.onrender.com';

const baseURL = process.env.NODE_ENV === 'development' ? localURL : hostedURL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

export default axiosInstance;