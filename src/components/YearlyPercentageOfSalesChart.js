import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';
import { generateHSLRainbowColor } from '../untils';

const YearlyPercentageOfSalesChart = ({ year }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/statistics/getYearlyPercentageOfSales`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });
        console.log('API response:', response.data);
        // Xử lý dữ liệu trả về có thể là object hoặc mảng
        const raw = response.data;
        const allYears = Array.isArray(raw) ? raw : raw.result;
        console.log('allYears:', allYears);
        if (Array.isArray(allYears)) {
          const yearData = allYears.find(item => item.year === year);
          console.log('Selected year:', year);
          console.log('Year data:', yearData);
          if (yearData && Array.isArray(yearData.statistics)) {
            setData(yearData.statistics);
            console.log('Statistics data:', yearData.statistics);
          } else {
            setData([]);
            console.log('No statistics found for year', year);
          }
        } else {
          setData([]);
          console.log('Dữ liệu trả về không phải mảng:', allYears);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu tỉ lệ bán ra theo năm.');
        console.error('API error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: 20 }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: 20 }}>{error}</div>;
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: 20 }}>Không có dữ liệu cho năm {year}.</div>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Tỉ lệ sản phẩm bán ra theo năm {year}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="salesPercentage"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ categoryName, salesPercentage }) => `${categoryName}: ${salesPercentage}%`}
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

export default YearlyPercentageOfSalesChart;