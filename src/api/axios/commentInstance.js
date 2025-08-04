import axios from 'axios';

const commentInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/v1/blogComment',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default commentInstance;
