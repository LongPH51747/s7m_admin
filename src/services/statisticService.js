// services/statisticsService.js (Nơi xử lý logic lấy và tổng hợp dữ liệu)
import axios from "axios";
import { parseDate } from "../untils";

// Trạng thái đơn hàng được tính vào doanh thu
const REVENUE_GENERATING_STATUSES = ["đã giao"]; // QUAN TRỌNG: Xác nhận lại!

export const response = await axios.get("http://192.168.1.9:3001/order");
const allOrders = response.data; // Giả lập
// Lấy các đơn hàng hợp lệ để tính doanh thu
const getValidOrdersForRevenue = (allOrders) => {
  return allOrders.filter((order) =>
    REVENUE_GENERATING_STATUSES.includes(order.status)
  );
};

// gán các đơn hàng hợp lệ để dễ dùng.
export const validOrders = getValidOrdersForRevenue(allOrders);

// 1. Thống kê theo năm
export const fetchYearlyRevenue = async () => {
  const yearlyData = {};

  validOrders.forEach((order) => {
    const date = parseDate(order.createat);
    const year = date.getFullYear();
    console.log("year" + year);

    if (!yearlyData[year]) {
      yearlyData[year] = { nam: year.toString(), doanhThu: 0 };
      console.log("year1" + yearlyData[year]);
    }
    yearlyData[year].doanhThu += order.totalamount;
  });
  return Object.values(yearlyData).sort(
    (a, b) => parseInt(a.nam) - parseInt(b.nam)
  );
};

// 2. Thống kê theo tháng của một năm
export const fetchMonthlyRevenue = async (targetYear) => {
  const monthlyResult = [];
  for (let m = 1; m <= 12; m++) {
    monthlyResult.push({ nam: targetYear, thang: m, doanhThu: 0 });
  }

  validOrders.forEach((order) => {
    const date = parseDate(order.createat);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    console.log("month" + month);

    if (year === targetYear) {
      const monthEntry = monthlyResult.find((entry) => entry.thang === month);
      if (monthEntry) {
        monthEntry.doanhThu += order.totalamount;
      }
    }
  });
  return monthlyResult;
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
  const quarterlyResult = [];

  for (let q = 1; q <= 4; q++) {
    quarterlyResult.push({ nam: targetYear, quy: q, doanhThu: 0 });
  }

  validOrders.forEach((order) => {
    const date = parseDate(order.createat);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (year === targetYear) {
      const quarter = getQuarterFromMonth(month);
      const quarterEntry = quarterlyResult.find(
        (entry) => entry.quy === quarter
      );
      if (quarterEntry) {
        quarterEntry.doanhThu += order.totalamount;
      }
    }
  });
  return quarterlyResult;
};

// 4. Thống kê theo khoảng ngày tùy chọn (hiển thị tổng doanh thu mỗi ngày)
export const fetchDailyRevenueInRange = async (startDateStr, endDateStr) => {
  const dailyData = {};

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  endDate.setHours(23, 59, 59, 999); // Bao gồm cả ngày kết thúc

  validOrders.forEach((order) => {
    const orderDate = parseDate(order.createat);
    if (orderDate >= startDate && orderDate <= endDate) {
      const dateKey = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { ngay: dateKey, doanhThu: 0 };
      }
      dailyData[dateKey].doanhThu += order.totalamount;
    }
  });
  return Object.values(dailyData).sort(
    (a, b) => new Date(a.ngay) - new Date(b.ngay)
  );
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

export const fetchYearlyOfAll = () => {
  const yearlyAll = {};

  validOrders.forEach((order) => {
    const date = parseDate(order.createat);
    const year = date.getFullYear();
    const cate = order.cate;
    const quantity = order.quantity;
    if (!yearlyAll[year]) {
      yearlyAll[year] = [];
    }
    if (!yearlyAll[year][cate]) {
      yearlyAll[year][cate] = 0;
      // yearlyAll[year].push({
      //   quantity: order.quantity,
      //   cate: order.cate,
      // });
    }
    yearlyAll[year][cate] += quantity;
  });

  console.log("yearsOFAll", yearlyAll);

  const finalResultYearlyAll = {};
  Object.keys(yearlyAll)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((year) => {
      const cateInYear = yearlyAll[year];
      const summaryForThisYear = [];
      Object.keys(cateInYear)
        .sort()
        .forEach((cateName) => {
          summaryForThisYear.push({
            cate: cateName,
            quantity: cateInYear[cateName],
          });
        });
      finalResultYearlyAll[year] = summaryForThisYear;
    });

  console.log("finalResultYearlyAll ", finalResultYearlyAll);

  return finalResultYearlyAll;
};
