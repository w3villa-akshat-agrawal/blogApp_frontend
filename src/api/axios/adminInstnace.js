import axios from 'axios';

const adminInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default adminInstance;
