import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';
import { generateHSLRainbowColor } from '../untils';

const DateRangePercentageOfSalesChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm tiện ích để chuyển đổi định dạng ngày YYYY-MM-DD sang d-m-yyyy cho backend
  const convertToDMY = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split("-");
    return `${parseInt(d)}-${parseInt(m)}-${y}`;
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      setData([]);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Chuyển đổi định dạng ngày cho backend
        const formattedStartDate = convertToDMY(startDate);
        const formattedEndDate = convertToDMY(endDate);
        
        const response = await axios.get(
          `${API_BASE}/statistics/getDateRangePercentageOfSales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Không thể tải dữ liệu tỉ lệ bán ra theo khoảng ngày.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  if (!startDate || !endDate) return <div style={{ textAlign: 'center', padding: 20 }}>Vui lòng chọn khoảng ngày.</div>;
  if (isLoading) return <div style={{ textAlign: 'center', padding: 20 }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: 20 }}>{error}</div>;
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: 20 }}>Không có dữ liệu cho khoảng ngày đã chọn.</div>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Tỉ lệ sản phẩm bán ra từ {startDate} đến {endDate}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ categoryName, percentage }) => `${categoryName}: ${percentage}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={generateHSLRainbowColor(index, data.length)} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DateRangePercentageOfSalesChart;