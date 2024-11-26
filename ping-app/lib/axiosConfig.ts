import axios from 'axios';

const localURL = 'http://localhost:5000';
const hostedURL = 'https://buzzhive-4zkh.onrender.com';

const baseURL = process.env.NODE_ENV === 'development' ? localURL : hostedURL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

export default axiosInstance;