import axios from 'axios';
import { API_BASE } from './LinkApi';

const BANNER_API = `${API_BASE}/banner`;

export const getAllBanners = async () => {
  const response = await axios.get(`${BANNER_API}/get-all-banner`);
  return response.data;
};

export const addBanner = async (bannerData) => {
  const response = await axios.post(`${BANNER_API}/add-banner`, bannerData);
  return response.data;
};

export const deleteBannerById = async (id) => {
  const response = await axios.delete(`${BANNER_API}/delete-banner-by-id/id/${id}`);
  return response.data;
};
