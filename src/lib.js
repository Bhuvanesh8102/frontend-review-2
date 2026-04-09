import axios from 'axios';

// 1. Set your Render URL here
export const BACKENDURL = "https://backend-review-2-wo1o.onrender.com";

// 2. Create an Axios instance
const apiClient = axios.create({
  baseURL: BACKENDURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;