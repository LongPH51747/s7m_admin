import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';

const ProductBestSaleByYearTable = ({ year }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE}/statistics/getProductBestSaleByYear`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    }).then(res => {
      // Lọc theo năm nếu cần
      setData(res.data.filter(item => item.year === year));
    });
  }, [year]);
  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center' }}>Top sản phẩm bán chạy nhất năm {year}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>STT</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Tên sản phẩm</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Số lượng bán</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.product_name}</td>
              <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>{item.totalQuantitySold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductBestSaleByYearTable;