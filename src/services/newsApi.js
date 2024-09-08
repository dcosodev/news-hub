import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Use this for Android emulator
// const API_URL = 'http://localhost:8000'; // Use this for iOS simulator
// const API_URL = 'http://YOUR_LOCAL_IP:8000'; // Use this for physical devices

const api = axios.create({
  baseURL: API_URL,
});

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchNewsByCategory = async (category) => {
  try {
    const response = await api.get(`/news/${category}`);
    return response.data.news;
  } catch (error) {
    console.error(`Error fetching news for ${category}:`, error);
    throw error;
  }
};