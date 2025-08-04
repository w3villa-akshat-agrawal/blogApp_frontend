import axios from 'axios';

const blogInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/v1/blog',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default blogInstance;
