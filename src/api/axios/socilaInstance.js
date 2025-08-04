import axios from 'axios';

const socilaInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/app/v1/social',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default socilaInstance;
