import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = BASE_URL; 
axiosInstance.defaults.timeout = 10000; // abort after 10sec
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
