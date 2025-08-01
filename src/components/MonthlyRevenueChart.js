// MonthlyRevenueChart.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatCurrencyVND } from '../untils';
import axios from 'axios';
import { API_BASE } from '../services/LinkApi';

const MonthlyRevenueChart = ({ year, titlePrefix = "Doanh thu các Tháng năm" }) => {
 
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async() => {
      if(!year){
        setIsLoading(false);
        setMonthlyRevenueData([]);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE}/statistics/getMonthlyRevenue?year=${year}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true' 
          }
        });
        console.log("----Response theo tháng: ", response)
        const rawMonthlyData = response.data.result;

        if(!Array.isArray(rawMonthlyData)){
            
          console.warn("Dữ liệu tháng trả về từ backend không phải là mảng:", rawMonthlyData);
            setMonthlyRevenueData([]);
            return;
        }
        const monthlyResult = [];
         for (let m = 1; m <= 12; m++) {
            const monthData = rawMonthlyData.find(item => item.month === m); // Giả sử BE trả về field là 'month' và 'totalRevenue'
            monthlyResult.push({
                nam: year, // Năm được truyền vào
                thang: m, // Số thứ tự tháng (1-12)
                doanhThu: monthData ? monthData.totalRevenue : 0 // Nếu có dữ liệu, lấy totalRevenue, ngược lại là 0
            });
        }
        setMonthlyRevenueData(monthlyResult);
      } catch (error) {
          console.error(`Lỗi khi tải dữ liệu doanh thu theo tháng cho năm ${year}:`, error);
        setError("Không thể tải dữ liệu doanh thu theo tháng. Vui lòng thử lại sau.");
      }finally{
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [year]);

  const formatMonth = (monthNumber) => `T${monthNumber}`;

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu doanh thu tháng năm {year}...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }

  if (!monthlyRevenueData || monthlyRevenueData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu cho năm {year}.</div>;
  }
  

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>{titlePrefix} {year}</h3>
      <ResponsiveContainer>
        <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 40, left: 70, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="thang" tickFormatter={formatMonth} tick={{ fontSize: 12 }}>
            <Label value="Tháng" offset={-15} position="insideBottom" style={{ fontSize: 14, fill: '#333' }} />
          </XAxis>
          <YAxis tickFormatter={formatCurrencyVND} tick={{ fontSize: 10 }} domain={["auto", 'auto']}>
            <Label value="Doanh thu" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 14, fill: '#333' }} offset={-50} />
          </YAxis>
          <Tooltip
            formatter={(value) => [formatCurrencyVND(value), "Doanh thu"]}
            labelFormatter={(label) => `Tháng ${label}`}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px" }} />
          <Line type="monotone" dataKey="doanhThu" stroke="#28a745" strokeWidth={2.5} activeDot={{ r: 8 }} name="Doanh thu hàng tháng" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default MonthlyRevenueChart;