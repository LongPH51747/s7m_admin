// src/services/statisticUserService.js

import axios from 'axios';
import { API_BASE } from './LinkApi';

const STATISTICS_API = `${API_BASE}/api/statistics`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };
};

// --- Nhóm 1: Thống kê theo TỔNG GIÁ TIỀN ---

export const getTopSpendersByMonth = async (year, month) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopSpendersByMonth`, {
    // API yêu cầu `year` và `month`, `limit` là tùy chọn
    params: { year, month },
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopSpendersYearly = async (year) => { // API này không có limit
  const { data } = await axios.get(`${STATISTICS_API}/getTopSpendersYearly`, {
    params: { year },
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopSpendersQuarterly = async (year, quarter) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopSpendersQuarterly`, {
    params: { year, quarter },
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopSpendersByCustomRange = async (startDate, endDate) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopSpendersByCustomRange`, {
    params: { startDate, endDate },
    headers: getAuthHeaders()
  });
  return data;
};

// --- Nhóm 2: Thống kê theo TỔNG SỐ LƯỢNG SẢN PHẨM ---

export const getTopBuyersByItemQuantityMonthly = async (year, month) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopBuyersByItemQuantityMonthly`, {
    params: { year, month},
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopBuyersByItemQuantityYearly = async (year) => { // API này không có limit
  const { data } = await axios.get(`${STATISTICS_API}/getTopBuyersByItemQuantityYearly`, {
    params: { year },
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopBuyersByItemQuantityQuarterly = async (year, quarter) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopBuyersByItemQuantityQuarterly`, {
    params: { year, quarter },
    headers: getAuthHeaders()
  });
  return data;
};

export const getTopBuyersByItemQuantityDateRange = async (startDate, endDate) => {
  const { data } = await axios.get(`${STATISTICS_API}/getTopBuyersByItemQuantityDateRange`, {
    params: { startDate, endDate},
    headers: getAuthHeaders()
  });
  return data;
};