import axios from "axios";



const planInstance = axios.create({
  baseURL: 'https://blog-backend-l8vd.onrender.com/api/v1/userPlan',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default planInstance;