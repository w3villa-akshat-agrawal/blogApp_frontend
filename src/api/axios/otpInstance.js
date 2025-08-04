import axios from "axios";



 const otpInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/otp',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const otpInstance2 = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/otp',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default otpInstance;