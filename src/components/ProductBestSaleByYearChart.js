import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';

const ProductBestSaleByYearChart = ({ year }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!year) return;
    axios.get(`${API_BASE}/statistics/getProductBestSaleByYear`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data.filter(item => item.year === year) : [];
        setData(arr);
      })
      .catch(() => setData([]));
  }, [year]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Top sản phẩm bán chạy nhất năm {year}</h3>
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

export default ProductBestSaleByYearChart;