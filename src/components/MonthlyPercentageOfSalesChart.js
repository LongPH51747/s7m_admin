import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';
import { generateHSLRainbowColor } from '../untils';

const MonthlyPercentageOfSalesChart = ({ year, month }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE}/statistics/getMonthlyPercentageOfSales?year=${year}`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        // Tìm đúng tháng được chọn
        const allMonths = Array.isArray(response.data) ? response.data : response.data.result;
        const monthData = allMonths.find(item => item.month === month);
        if (monthData && Array.isArray(monthData.statistics)) {
          setData(monthData.statistics);
        } else {
          setData([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu tỉ lệ bán ra theo tháng.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year, month]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: 20 }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: 20 }}>{error}</div>;
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: 20 }}>Không có dữ liệu cho tháng {month}/{year}.</div>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Tỉ lệ sản phẩm bán ra tháng {month}/{year}</h3>
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

export default MonthlyPercentageOfSalesChart;