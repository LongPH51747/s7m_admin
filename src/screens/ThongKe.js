// StatisticsDashboard.js (hoặc App.js)
import React, { useState, useEffect } from 'react';
import YearlyRevenueChart from '../components/YearlyRevenueChart';
import MonthlyRevenueChart from '../components/MonthlyRevenueChart';
import QuarterlyRevenueChart from '../components/QuarterlyRevenueChart';

// --- Dữ liệu giả lập ---
const fakeYearlyData = [
  { nam: '2021', doanhThu: 0 },
  { nam: '2022', doanhThu: 1200000000 },
  { nam: '2023', doanhThu: 1500000000 },
  { nam: '2024', doanhThu: 1850000000 },
  { nam: '2025', doanhThu: 2100000000 },
];

const fakeMonthlyData = {
  2023: [
    { thang: 1, doanhThu: 100000000 }, { thang: 2, doanhThu: 110000000 },
    { thang: 3, doanhThu: 130000000 }, { thang: 4, doanhThu: 120000000 },
    { thang: 5, doanhThu: 140000000 }, { thang: 6, doanhThu: 150000000 },
    { thang: 7, doanhThu: 160000000 }, { thang: 8, doanhThu: 130000000 },
    { thang: 9, doanhThu: 140000000 }, { thang: 10, doanhThu: 170000000 },
    { thang: 11, doanhThu: 180000000 }, { thang: 12, doanhThu: 220000000 },
  ],
  2024: [
    { thang: 1, doanhThu: 120000000 }, { thang: 2, doanhThu: 130000000 },
    { thang: 3, doanhThu: 150000000 }, { thang: 4, doanhThu: 140000000 },
    { thang: 5, doanhThu: 160000000 }, { thang: 6, doanhThu: 170000000 },
    { thang: 7, doanhThu: 120000000 }, { thang: 8, doanhThu: 130000000 },
    { thang: 9, doanhThu: 150000000 }, { thang: 10, doanhThu: 140000000 },
    { thang: 11, doanhThu: 160000000 }, { thang: 12, doanhThu: 170000000 },
    // ... thêm dữ liệu cho các tháng còn lại của 2024
  ],
   2025: [
    { thang: 1, doanhThu: 130000000 }, { thang: 2, doanhThu: 145000000 },
    { thang: 3, doanhThu: 140000000 }, { thang: 4, doanhThu: 185000000 },
    { thang: 5, doanhThu: 150000000 }, { thang: 6, doanhThu: 145000000 },
    { thang: 7, doanhThu: 160000000 }, { thang: 8, doanhThu: 175000000 },
    { thang: 9, doanhThu: 170000000 }, { thang: 10, doanhThu: 125000000 },
    { thang: 11, doanhThu: 180000000 }, { thang: 12, doanhThu: 155000000 },
    // ... thêm dữ liệu
  ],
};

const fakeQuarterlyData = {
  2023: [
    { quy: 1, doanhThu: 340000000 }, { quy: 2, doanhThu: 410000000 },
    { quy: 3, doanhThu: 430000000 }, { quy: 4, doanhThu: 570000000 },
  ],
  2024: [
    { quy: 1, doanhThu: 400000000 }, { quy: 2, doanhThu: 470000000 },
    { quy: 3, doanhThu: 400000000 }, { quy: 4, doanhThu: 470000000 },
    // ... thêm dữ liệu cho các quý còn lại của 2024
  ],
  2025: [
    { quy: 1, doanhThu: 450000000 },
    { quy: 2, doanhThu: 500000000 },
    { quy: 3, doanhThu: 300000000 },
    { quy: 4, doanhThu: 750000000 },
    // ... thêm dữ liệu
  ],
};
// --- Kết thúc dữ liệu giả lập ---

const availableYears = [2022, 2023, 2024, 2025]; // Các năm có dữ liệu để chọn

const StatisticsDashboard = () => {
  const [statType, setStatType] = useState('yearly'); // 'yearly', 'monthly', 'quarterly'
  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1]); // Năm mới nhất
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Giả lập gọi API dựa trên statType và selectedYear
    console.log(`Workspaceing data for type: ${statType}, year: ${selectedYear}`);
    if (statType === 'yearly') {
      setChartData(fakeYearlyData);
    } else if (statType === 'monthly') {
      setChartData(fakeMonthlyData[selectedYear] || []);
    } else if (statType === 'quarterly') {
      setChartData(fakeQuarterlyData[selectedYear] || []);
    }
  }, [statType, selectedYear]);

  const commonSelectStyle = {
    padding: '10px',
    margin: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Bảng Điều Khiển Thống Kê Doanh Thu</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '20px', alignItems: 'center' }}>
        <div>
          <label htmlFor="statTypeSelect" style={{ marginRight: '10px', fontSize: '16px' }}>Loại thống kê:</label>
          <select
            id="statTypeSelect"
            value={statType}
            onChange={(e) => setStatType(e.target.value)}
            style={commonSelectStyle}
          >
            <option value="yearly">Theo Năm</option>
            <option value="monthly">Theo Tháng</option>
            <option value="quarterly">Theo Quý</option>
          </select>
        </div>

        {(statType === 'monthly' || statType === 'quarterly') && (
          <div>
            <label htmlFor="yearSelect" style={{ marginRight: '10px', fontSize: '16px' }}>Chọn năm:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={commonSelectStyle}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Khu vực hiển thị biểu đồ */}
      {statType === 'yearly' && <YearlyRevenueChart data={chartData} />}
      {statType === 'monthly' && chartData.length > 0 && (
        <MonthlyRevenueChart data={chartData} year={selectedYear} />
      )}
      {statType === 'monthly' && chartData.length === 0 && (
         <div style={{ textAlign: 'center', padding: '20px', color: 'orange' }}>
            Không có dữ liệu doanh thu theo tháng cho năm {selectedYear}.
        </div>
      )}
      {statType === 'quarterly' && chartData.length > 0 && (
        <QuarterlyRevenueChart data={chartData} year={selectedYear} />
      )}
      {statType === 'quarterly' && chartData.length === 0 && (
         <div style={{ textAlign: 'center', padding: '20px', color: 'orange' }}>
            Không có dữ liệu doanh thu theo quý cho năm {selectedYear}.
        </div>
      )}
    </div>
  );
};

export default StatisticsDashboard;
