import axios from 'axios';

const commentInstance = axios.create({
  baseURL: 'http://localhost:3008/api/v1/blogComment',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default commentInstance;
