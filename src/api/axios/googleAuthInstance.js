import axios from 'axios';

const googleAuthInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default googleAuthInstance;
