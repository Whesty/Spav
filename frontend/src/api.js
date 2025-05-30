import axios from 'axios';

const api = axios.create({
  baseURL: 'https://spav-aget.onrender.com',
});

export default api;
