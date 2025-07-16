import axios from 'axios';

const googleAuthInstance = axios.create({
  baseURL: 'http://localhost:3008/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default googleAuthInstance;
