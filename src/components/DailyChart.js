// src/components/DailyChart.js (hoặc DailyRevenueRangeChart.js)
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatCurrencyVND } from '../untils'; // Đảm bảo đường dẫn đúng
import axios from 'axios'; // Import axios để gọi API
import { API_BASE } from '../services/LinkApi'; // Import API_BASE


const DailyRevenueRangeChart = ({ startDate, endDate }) => {
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // XÓA BỎ HOẶC COMMENT OUT HÀM convertToDMY vì không cần nữa
  // const convertToDMY = (isoDate) => {
  //   if (!isoDate) return ''; // Tránh lỗi nếu ngày rỗng
  //   const [y, m, d] = isoDate.split("-");
  //   return `${parseInt(d)}-${parseInt(m)}-${y}`;
  // };


  useEffect(() => {
    const fetchChartData = async () => {
      // Đảm bảo có đủ ngày bắt đầu và kết thúc để fetch
      if (!startDate || !endDate) {
        setIsLoading(false);
        setDailyRevenueData([]);
        return;
      }


      try {
        setIsLoading(true);
        setError(null);


        // XÓA BỎ CÁC DÒNG CHUYỂN ĐỔI ĐỊNH DẠNG NÀY
        // const formattedStartDate = convertToDMY(startDate);
        // const formattedEndDate = convertToDMY(endDate);


        // XÓA BỎ CÁC LOG NÀY NẾU KHÔNG CẦN THIẾT NỮA
        // console.log('Original dates:', startDate, endDate);
        // console.log('Formatted dates:', formattedStartDate, formattedEndDate); // Dòng này sẽ gây lỗi nếu xóa formattedStartDate/EndDate


        // Gọi API getRevenueByDateRange từ backend
        const response = await axios.get(
          // SỬ DỤNG TRỰC TIẾP startDate VÀ endDate VÌ CHÚNG ĐÃ CÓ ĐỊNH DẠNG YYYY-MM-DD
          `${API_BASE}/api/statistics/getRevenueByDateRange?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true' // Thêm header này nếu bạn dùng ngrok
            }
          }
        );
        // Dữ liệu thô từ backend: [{ "totalRevenue": X, "date": "YYYY-MM-DD" }, ...]
        const rawDailyData = response.data;


        // Kiểm tra nếu rawDailyData không phải là mảng hoặc null/undefined
        if (!Array.isArray(rawDailyData)) {
            console.warn("Dữ liệu doanh thu theo ngày trả về từ backend không phải là mảng:", rawDailyData);
            setDailyRevenueData([]);
            return;
        }


        // Ánh xạ dữ liệu từ backend sang định dạng mà Recharts mong muốn
        // Backend: { totalRevenue: X, date: "YYYY-MM-DD" }
        // Frontend: { ngay: "YYYY-MM-DD", doanhThu: X }
        const mappedData = rawDailyData.map(item => ({
            ngay: item.date,          // 'date' từ BE -> 'ngay' cho FE (giữ nguyên YYYY-MM-DD)
            doanhThu: item.totalRevenue // 'totalRevenue' từ BE -> 'doanhThu' cho FE
        })).sort((a, b) => new Date(a.ngay) - new Date(b.ngay)); // Sắp xếp theo ngày tăng dần


        setDailyRevenueData(mappedData);


      } catch (err) {
        console.error(`Lỗi khi tải dữ liệu doanh thu theo khoảng ngày ${startDate} - ${endDate}:`, err);
        setError("Không thể tải dữ liệu doanh thu theo khoảng ngày. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };


    fetchChartData();
  }, [startDate, endDate]); // Dependencies là 'startDate' và 'endDate' để gọi lại API khi chúng thay đổi


  const formatDateTick = (dateString) => {
    const date = new Date(dateString);
    // Đảm bảo ngày hợp lệ trước khi định dạng
    if (isNaN(date.getTime())) {
      return ''; // Trả về rỗng nếu ngày không hợp lệ
    }
    // Backend trả về YYYY-MM-DD, hiển thị DD/MM
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };


  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu doanh thu theo khoảng ngày...</div>;
  }


  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }


  if (!dailyRevenueData || dailyRevenueData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu cho khoảng ngày đã chọn.</div>;
  }


  return (
    <div style={{ width: '100%', height: 400 }}>
      {/* Tiêu đề vẫn hiển thị YYYY-MM-DD như đã nhận từ prop */}
      <h3 style={{ textAlign: 'center' }}>Doanh thu từ {startDate} đến {endDate}</h3>
      <ResponsiveContainer>
        <LineChart data={dailyRevenueData} margin={{ top: 20, right: 40, left: 70, bottom: 30 }}>
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

