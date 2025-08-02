// src/components/QuarterlyRevenueChart.js
import React, { useState, useEffect } from 'react'; // Bắt buộc phải import useState và useEffect
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; // Dùng BarChart cho Quý
import { formatCurrencyVND } from '../untils'; // Giả sử bạn tạo file này và hàm này
import axios from 'axios'; // Import axios để gọi API
import { API_BASE } from '../services/LinkApi'; // Import API_BASE

const QuarterlyRevenueChart = ({ year, titlePrefix = "Doanh thu các Quý năm" }) => { // Xóa prop 'data'
  const [quarterlyRevenueData, setQuarterlyRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tiện ích để chuyển đổi tháng sang quý (sẽ dùng ở đây)
  const getQuarterFromMonth = (month) => {
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
  };

  useEffect(() => {
    const fetchChartData = async () => {
      if (!year) { // Đảm bảo có năm để fetch
        setIsLoading(false);
        setQuarterlyRevenueData([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Bước 1: Gọi API getMonthlyRevenue từ backend
        // Giả định API nhận năm qua query parameter: ?year=YYYY
        const response = await axios.get(`${API_BASE}/api/statistics/getMonthlyRevenue?year=${year}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true' // Thêm header này nếu bạn dùng ngrok
          }
        });
        // Dữ liệu thô từ backend là một đối tượng chứa trường 'result'
        const rawMonthlyData = response.data.result; 

        // Kiểm tra nếu rawMonthlyData không phải là mảng hoặc null/undefined
        if (!Array.isArray(rawMonthlyData)) {
            console.warn("Dữ liệu tháng trả về từ backend không phải là mảng:", rawMonthlyData);
            setQuarterlyRevenueData([]);
            return;
        }

        // Bước 2: Tổng hợp dữ liệu từ tháng sang quý
        const quarterlyResult = [];
        for (let q = 1; q <= 4; q++) {
            quarterlyResult.push({ nam: year, quy: q, doanhThu: 0 });
        }

        rawMonthlyData.forEach(monthEntry => {
            const month = monthEntry.month; // Backend trả về 'month'
            const revenue = monthEntry.totalRevenue; // Backend trả về 'totalRevenue'

            const quarter = getQuarterFromMonth(month);
            const quarterEntry = quarterlyResult.find((entry) => entry.quy === quarter);

            if (quarterEntry) {
                quarterEntry.doanhThu += revenue;
            }
        });
        setQuarterlyRevenueData(quarterlyResult);

      } catch (err) {
        console.error(`Lỗi khi tải dữ liệu doanh thu theo quý cho năm ${year}:`, err);
        setError("Không thể tải dữ liệu doanh thu theo quý. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [year]); // Dependency là 'year' để gọi lại API khi năm thay đổi

  const formatQuarter = (quarterNumber) => `Q${quarterNumber}`;

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu doanh thu quý năm {year}...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }

  if (!quarterlyRevenueData || quarterlyRevenueData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu theo quý cho năm {year}.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>{titlePrefix} {year}</h3>
      <ResponsiveContainer>
        {/* Sử dụng BarChart cho thống kê theo quý để dễ so sánh hơn */}
        <BarChart data={quarterlyRevenueData} margin={{ top: 20, right: 40, left: 70, bottom: 20 }}>
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
