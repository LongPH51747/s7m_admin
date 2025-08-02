import axios from 'axios';
import { API_BASE } from './LinkApi';

const STATISTICS_API = `${API_BASE}/api/statistics`;

export const getTopSpenders = async (limit) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopSpenders`, {
    params: { limittopuser: limit },
    headers: { 'ngrok-skip-browser-warning': 'true' }
  });
  return data;
};

export const getTopBuyersByQuantity = async (limit) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopBuyersByItemQuantity`, {
    params: { limittopuser: limit },
    headers: { 'ngrok-skip-browser-warning': 'true' }
  });
  return data;
};
