// services/statisticsService.js (Nơi xử lý logic lấy và tổng hợp dữ liệu)
import axios from "axios";
import { parseDate } from "../untils";
import { API_BASE } from "./LinkApi";


// 1. Thống kê theo năm
export const fetchYearlyRevenue = async () => {
     try {
        const response = await axios.get(`${API_BASE}/statistics/getYearlyRevenue`);

        let dataFromBackend = response.data;

        if (!Array.isArray(dataFromBackend) && typeof dataFromBackend === 'object' && dataFromBackend !== null) {
            dataFromBackend = [dataFromBackend]; // Bọc đối tượng vào một mảng
        } else if (!Array.isArray(dataFromBackend)) {
            // Trường hợp dữ liệu không phải mảng và cũng không phải đối tượng hợp lệ (ví dụ: null, undefined)
            console.warn("Dữ liệu trả về từ getYearlyRevenue không phải mảng hoặc đối tượng hợp lệ.");
            return []; // Trả về mảng rỗng để tránh lỗi
        }
        // --- KẾT THÚC PHẦN QUAN TRỌNG ---

        // Dữ liệu từ API backend (sau khi đã được xử lý) có dạng: [{ totalRevenue: X, year: Y }, ...]
        // Component YearlyRevenueChart của bạn mong muốn: [{ nam: "Y", doanhThu: X }, ...]
        return dataFromBackend.map(item => ({
            nam: item.year.toString(),      // Chuyển số năm (year) thành chuỗi (nam)
            doanhThu: item.totalRevenue     // Lấy giá trị totalRevenue gán cho doanhThu
        })).sort((a, b) => parseInt(a.nam) - parseInt(b.nam)); // Đảm bảo sắp xếp theo năm tăng dần
    } catch (error) {
        console.error("Lỗi khi lấy doanh thu theo năm:", error);
        // Trả về mảng rỗng nếu có lỗi trong quá trình fetch (ví dụ: lỗi mạng, server 500)
        return [];
    }
 
};

// 2. Thống kê theo tháng của một năm
export const fetchMonthlyRevenue = async (targetYear) => {
      try {
        const response = await axios.get(`${API_BASE}/statistics/getMonthlyRevenue?year=${targetYear}`);
        const backenData = response.data;  // dữ liệu từ be

        const monthlyResult = [];
        for(let m = 1; m <= 12; m++){
          const monthData = backenData.find(item => item.month === m);
          monthlyResult.push({
            nam: targetYear,
            thang: m,
            doanhThu: monthData ? monthData.totalRevenue : 0  // nếu có dữ liệu, lấy tổng doanh thu, ngược lại = 0
          });
        }
         return monthlyResult;
      } catch (error) {
        console.error(`Lỗi khi lấy doanh thu theo tháng cho năm ${targetYear}:`, error);
        throw error;
      }
};

// 3. Thống kê theo quý của một năm
const getQuarterFromMonth = (month) => {
  // month is 1-12
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
};

export const fetchQuarterlyRevenue = async (targetYear) => {
      try {
        const monthyData = await fetchMonthlyRevenue(targetYear);
        const quarterlyResult = [];

        for(let q = 1; q <= 4; q++){
          quarterlyResult.push({nam: targetYear, quy: q, doanhThu: 0});
        };

        monthyData.forEach(monthEntry => {
          const month = monthEntry.thang;
          const revenue = monthEntry.doanhThu;

          const quarter = getQuarterFromMonth(month);
          const quarterEntry = quarterlyResult.find(
            (entry) => entry.quy === quarter
          );

          if(quarterEntry){
            quarterEntry.doanhThu += revenue;
          }
        });
        return quarterlyResult
      } catch (error) {
        console.error(`Lỗi khi tổng hợp doanh thu theo quý cho năm ${targetYear}:`, error);
        throw error;
      }
};

// 4. Thống kê theo khoảng ngày tùy chọn (hiển thị tổng doanh thu mỗi ngày)
export const fetchDailyRevenueInRange = async (startDateStr, endDateStr) => {
  try {
    const convertToDMY = (isoDate) => {
      const [y, m, d] = isoDate.split("-");
      return `${parseInt(d)}-${parseInt(m)}-${y}`;
    };

    const formattedStartDate = convertToDMY(startDateStr);
    const formattedEndDate   = convertToDMY(endDateStr);

    const response = await axios.get(
      `${API_BASE}/statistics/getRevenueByDateRange?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );

    const backendData = response.data;
    if(Array.isArray(backendData)){
      const mappedData = backendData.map(item => {
        return {
          ngay: item.date,
          doanhThu: item.totalRevenue
        };
      });
      return mappedData.sort((a, b) => new Date(a.ngay) - new Date(b.ngay));
    }else{
      console.warn("Dữ liệu trả về từ getRevenueByDateRange không phải là mảng hoặc trống.");
      return []; 
    }
  } catch (error) {
    console.error(`Lỗi khi lấy doanh thu theo khoảng ngày ${startDateStr} - ${endDateStr}:`, error);
        throw error;
  }
};

//Lấy các đơn hàng thuộc từng cate

// 5. thống kê biểu đồ tròn tỉ lệ bán ra theo năm
// export const fetchYearlyProportion = () => {
//   const yearlyData = {};

//   validOrders.forEach((order) => {
//     const date = parseDate(order.createat);
//     const year = date.getFullYear();
//     const cate = order.cate;

//     if (!yearlyData[cate]) {
//       yearlyData[cate] = { nam: year.toString(), quantity: 0, cate: cate };
//     }
//     yearlyData[cate].quantity += order.quantity;
//   });
//   return Object.values(yearlyData).sort(
//     (a, b) => parseInt(a.nam) - parseInt(b.nam)
//   );
// };

export const fetchYearlyOfAll = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/statistics/getYearlyPercentageOfSales`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true", // nếu đang test ngrok
        },
      }
    );

    // Response là 1 mảng chứa nhiều năm
    return response.data;
    console.log("Fetch Yearly off all")
  } catch (error) {
    console.error("Lỗi fetchYearlyOfAll:", error);
    return [];
  }
};
