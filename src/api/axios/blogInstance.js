import axios from 'axios';

const blogInstance = axios.create({
  baseURL: 'http://localhost:3008/api/v1/blog',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default blogInstance;
