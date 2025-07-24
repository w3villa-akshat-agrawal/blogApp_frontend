import axios from 'axios';

const adminInstance = axios.create({
  baseURL: 'http://localhost:3008/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default adminInstance;