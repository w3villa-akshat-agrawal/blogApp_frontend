import axios from "axios";



const otpInstance = axios.create({
  baseURL: 'http://localhost:3009/api/otp',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default otpInstance;