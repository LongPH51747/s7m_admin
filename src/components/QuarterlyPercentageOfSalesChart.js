import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';
import { generateHSLRainbowColor } from '../untils';

const QuarterlyPercentageOfSalesChart = ({ year, quarter }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE}/statistics/getQuaterPercentOfSales?year=${year}`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        // Tìm đúng quý được chọn
        const allQuarters = Array.isArray(response.data) ? response.data : response.data.result;
        const quarterData = allQuarters.find(item => item.quarter === quarter);
        if (quarterData && Array.isArray(quarterData.statistics)) {
          setData(quarterData.statistics);
        } else {
          setData([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu tỉ lệ bán ra theo quý.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year, quarter]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: 20 }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: 20 }}>{error}</div>;
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: 20 }}>Không có dữ liệu cho quý {quarter}/{year}.</div>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Tỉ lệ sản phẩm bán ra quý {quarter}/{year}</h3>
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

export default QuarterlyPercentageOfSalesChart;