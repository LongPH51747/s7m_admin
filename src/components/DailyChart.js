// DailyRevenueRangeChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatCurrencyVND } from '../untils'; // Đảm bảo đường dẫn đúng

const DailyRevenueRangeChart = ({ data, startDate, endDate }) => {

  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu cho khoảng ngày đã chọn.</div>;
  }

  const formatDateTick = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`; // DD/MM
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Doanh thu từ {startDate} đến {endDate}</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 70, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="ngay" tickFormatter={formatDateTick} tick={{ fontSize: 10 }} angle={-20} textAnchor="end">
            <Label value="Ngày" offset={-15} position="insideBottom" style={{ fontSize: 14, fill: '#333' }} />
          </XAxis>
          <YAxis tickFormatter={formatCurrencyVND} tick={{ fontSize: 10 }} domain={[0, 'dataMax + 1000000']}>
            <Label value="Doanh thu" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 14, fill: '#333' }} offset={-50} />
          </YAxis>
          <Tooltip
            formatter={(value) => [formatCurrencyVND(value), "Doanh thu"]}
            labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString('vi-VN')}`}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px" }}/>
          <Line type="monotone" dataKey="doanhThu" stroke="#6f42c1" strokeWidth={2} activeDot={{ r: 6 }} name="Doanh thu hàng ngày" dot={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyRevenueRangeChart;