import axios from "axios";



const planInstance = axios.create({
  baseURL: 'http://localhost:3008/api/v1/userPlan',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default planInstance;