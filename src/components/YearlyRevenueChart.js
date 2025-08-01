// src/components/YearlyRevenueChart.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatCurrencyVND } from '../untils'; // Đảm bảo đường dẫn này đúng
import axios from 'axios'; // Import axios
import { API_BASE } from '../services/LinkApi'; // Đảm bảo đường dẫn này đúng

const YearlyRevenueChart = () => { // Không nhận props 'data' nữa
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API để lấy dữ liệu doanh thu theo năm
        // Dựa trên ảnh Swagger, API này có vẻ không nhận tham số năm.
        // Tôi sẽ giả định nó trả về một mảng dữ liệu nhiều năm nếu bạn muốn vẽ biểu đồ nhiều năm.
        // Nếu nó chỉ trả về một đối tượng đơn { totalRevenue: X } cho một năm cụ thể,
        // bạn sẽ cần điều chỉnh để hiển thị thông tin đó, không phải biểu đồ cột nhiều năm.
        const response = await axios.get(`${API_BASE}/api/statistics/getYearlyRevenue`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        const rawData = response.data.result || response.data; // Lấy dữ liệu, kiểm tra `result`
        console.log("----Response theo năm: ", rawData);

        if (!Array.isArray(rawData)) {
          // Xử lý trường hợp API chỉ trả về một đối tượng đơn hoặc dữ liệu không phải mảng
          // Nếu API thực sự chỉ trả về { "totalRevenue": 300000000, "year": 2025 }
          // thì bạn có thể chuyển nó thành một mảng để Recharts có thể vẽ.
          if (rawData && typeof rawData === 'object' && rawData.totalRevenue !== undefined) {
             setYearlyRevenueData([{ nam: rawData.year || 'Tổng', totalRevenue: rawData.totalRevenue }]);
          } else {
            console.warn("Dữ liệu năm trả về từ backend không phải là mảng hoặc không đúng định dạng:", rawData);
            setYearlyRevenueData([]);
          }
        } else {
          // Nếu API trả về mảng (ví dụ: [{ year: 2025, totalRevenue: X }])
          // Chuyển đổi key 'year' thành 'nam' cho đúng với biểu đồ
          const mappedData = rawData.map(item => ({
            nam: item.nam !== undefined ? item.nam : item.year, // Ưu tiên 'nam', fallback 'year'
            totalRevenue: item.totalRevenue
          })).sort((a, b) => a.nam - b.nam);
          setYearlyRevenueData(mappedData);
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu theo năm:", error);
        setError("Không thể tải dữ liệu doanh thu theo năm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []); // [] để chỉ chạy một lần khi component mount

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu doanh thu năm...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }

  if (!yearlyRevenueData || yearlyRevenueData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu doanh thu theo năm.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400, marginBottom: '40px' }}>
      <h3 style={{ textAlign: 'center' }}>Doanh thu theo Năm</h3>
      <ResponsiveContainer>
        <LineChart data={yearlyRevenueData} margin={{ top: 20, right: 40, left: 70, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="nam" tick={{ fontSize: 12 }}> {/* 'nam' là key cho năm */}
            <Label value="Năm" offset={-15} position="insideBottom" style={{ fontSize: 14, fill: '#333' }} />
          </XAxis>
          <YAxis tickFormatter={formatCurrencyVND} tick={{ fontSize: 10 }} domain={["auto", 'auto']}>
            <Label value="Doanh thu" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 14, fill: '#333' }} offset={-50} />
          </YAxis>
          <Tooltip formatter={(value) => [formatCurrencyVND(value), "Doanh thu"]} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px" }} />
          <Line type="monotone" dataKey="totalRevenue" stroke="#007bff" strokeWidth={2.5} activeDot={{ r: 8 }} name="Doanh thu hàng năm" /> {/* 'totalRevenue' là key cho giá trị */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyRevenueChart;