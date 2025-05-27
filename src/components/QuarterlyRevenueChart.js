// QuarterlyRevenueChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; // Dùng BarChart cho Quý
import { formatCurrencyVND } from '../untils';

const QuarterlyRevenueChart = ({ data, year, titlePrefix = "Doanh thu các Quý năm" }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu theo quý cho năm {year}.</div>;
  }

  const formatQuarter = (quarterNumber) => `Q${quarterNumber}`;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>{titlePrefix} {year}</h3>
      <ResponsiveContainer>
        {/* Sử dụng BarChart cho thống kê theo quý để dễ so sánh hơn */}
        <BarChart data={data} margin={{ top: 20, right: 40, left: 70, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="quy" tickFormatter={formatQuarter} tick={{ fontSize: 12 }}>
            <Label value="Quý" offset={-15} position="insideBottom" style={{ fontSize: 14, fill: '#333' }} />
          </XAxis>
          <YAxis tickFormatter={formatCurrencyVND} tick={{ fontSize: 10 }} domain={[0, 'auto']}>
            <Label value="Doanh thu" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 14, fill: '#333' }} offset={-50} />
          </YAxis>
          <Tooltip
            formatter={(value) => [formatCurrencyVND(value), "Doanh thu"]}
            labelFormatter={(label) => `Quý ${label}`}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px" }} />
          <Bar dataKey="doanhThu" fill="#ffc107" name="Doanh thu hàng quý" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default QuarterlyRevenueChart;