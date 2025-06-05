import axios from 'axios';
import { API_BASE } from './LinkApi';

const CATEGORY_API = `${API_BASE}`;

export const getAllCategories = async () => {
  const res = await axios.get(`${CATEGORY_API}/categories/get-all-categories`);
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const addCategory = async (categoryData) => {
  const res = await axios.post(`${CATEGORY_API}/categories/create-category`, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${CATEGORY_API}/categories/delete-category-by-id/id/${id}`);
  return res.data;
};
