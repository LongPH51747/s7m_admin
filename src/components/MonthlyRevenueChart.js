// MonthlyRevenueChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatCurrencyVND } from '../untils';

const MonthlyRevenueChart = ({ data, year, titlePrefix = "Doanh thu các Tháng năm" }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu cho năm {year}.</div>;
  }

  // Chuyển đổi số tháng thành tên tháng (ví dụ)
  const formatMonth = (monthNumber) => `T${monthNumber}`;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>{titlePrefix} {year}</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 70, bottom: 20 }}>
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