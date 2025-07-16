import axios from 'axios';

const socilaInstance = axios.create({
  baseURL: 'http://localhost:3008/app/v1/social',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default socilaInstance;
