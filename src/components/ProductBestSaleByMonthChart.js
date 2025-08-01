import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';

const ProductBestSaleByMonthChart = ({ year, month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!year || !month) {
      setData([]);
      return;
    }
    axios.get(`${API_BASE}/statistics/getProductBestSaleByMonth?year=${year}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    }).then(res => {
      // Lọc theo tháng
      setData(res.data.filter(item => item.month === month));
    });
  }, [year, month]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Top sản phẩm bán chạy nhất tháng {month}/{year}</h3>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 30, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="product_name" type="category" width={150} />
          <Tooltip />
          <Bar dataKey="totalQuantitySold" fill="#007bff">
            <LabelList dataKey="totalQuantitySold" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductBestSaleByMonthChart; 