// StatisticsDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import YearlyRevenueChart from "../components/YearlyRevenueChart";
import MonthlyRevenueChart from "../components/MonthlyRevenueChart";
import QuarterlyRevenueChart from "../components/QuarterlyRevenueChart";
import DailyRevenueRangeChart from "../components/DailyChart"; // Import mới
import {
  fetchYearlyRevenue,
  fetchMonthlyRevenue,
  fetchQuarterlyRevenue,
  fetchDailyRevenueInRange,
  //   fetchYearlyProportion,
  fetchYearlyOfAll,
} from "../services/statisticService"; // Giả sử bạn đặt các hàm fetch ở đây

// Lấy các năm duy nhất từ dữ liệu để làm dropdown (chỉ cần chạy 1 lần)
// Trong thực tế, API có thể cung cấp danh sách năm này
import { response } from "../services/statisticService";
import { parseDate, createColorMap } from "../untils";
import CateRevenueChart from "../components/CateProportionChart";

const StatisticsDashboard = () => {
  const dbData = response.data;

  const getAvailableYears = () => {
    const years = new Set();
    dbData.forEach((order) => {
      years.add(parseDate(order.createat).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a); // Sắp xếp giảm dần
  };

  const availableYears = getAvailableYears();

  const [statType, setStatType] = useState("yearly"); // 'yearly', 'monthly', 'quarterly', 'customRange'
  const [selectedYear, setSelectedYear] = useState(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );
  const [chartData, setChartData] = useState([]);
  const [chartDataPropor, setChartDataPropor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cho Custom Date Range
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    console.log(
      `Đang tải dữ liệu cho: ${statType}, Năm: ${selectedYear}, Từ: ${startDate}, Đến: ${endDate}`
    );
    try {
      if (statType === "yearly") {
        setChartData(await fetchYearlyRevenue());
        setChartDataPropor(await fetchYearlyOfAll());
      } else if (statType === "monthly") {
        setChartData(await fetchMonthlyRevenue(selectedYear));
      } else if (statType === "quarterly") {
        setChartData(await fetchQuarterlyRevenue(selectedYear));
      } else if (statType === "customRange") {
        // Chuyển đổi định dạng YYYY-MM-DD sang D/M/YYYY cho hàm fetch
        const convertToDMY = (isoDate) => {
          const [y, m, d] = isoDate.split("-");
          return `${parseInt(d)}/${parseInt(m)}/${y}`;
        };
        setChartData(
          await fetchDailyRevenueInRange(
            convertToDMY(startDate),
            convertToDMY(endDate)
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê:", error);
      setChartData([]); // Xóa dữ liệu cũ nếu có lỗi
    } finally {
      setIsLoading(false);
    }
  }, [statType, selectedYear, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]); // loadData đã bao gồm các dependency của nó

  const commonSelectStyle = {
    /* ... style như cũ ... */
    padding: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };
  const dateInputStyle = {
    /* ... style cho date input ... */
    padding: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const yearsOfPropor = Object.keys(chartDataPropor).sort();
  console.log("chartDataPropor: ", chartDataPropor);
  console.log("yearsOfPropor: ", yearsOfPropor);

  const { cateColors } = useMemo(() => {
    if (!chartDataPropor || chartDataPropor.length === 0) {
      return { uniqCates: [], cateColors: {} };
    }
    return createColorMap(chartDataPropor);
  }, [chartDataPropor]);

  console.log("Colors", cateColors);

  return (
    <div>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          marginTop: 10,
        }}
      >
        {/* <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Thống Kê Doanh Thu
        </h1> */}

        <div
          style={{
            position: "absolute",
            top: 10,
            left: 30,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label style={{ marginRight: 10 }}>Loại thống kê:</label>
            <select
              value={statType}
              onChange={(e) => setStatType(e.target.value)}
              style={commonSelectStyle}
            >
              <option value="yearly">Theo Năm</option>
              <option value="monthly">Theo Tháng</option>
              <option value="quarterly">Theo Quý</option>
              <option value="customRange">Khoảng Ngày Tùy Chọn</option>
            </select>
          </div>

          {(statType === "monthly" || statType === "quarterly") && (
            <div>
              <label style={{ marginRight: 10 }}>Chọn năm: </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={commonSelectStyle}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {statType === "customRange" && (
            <>
              <div>
                <label style={{ marginRight: 10 }}>Từ ngày: </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>
              <div>
                <label style={{ marginRight: 10 }}>Đến ngày: </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>
            </>
          )}
        </div>

        <div style={{ padding: 18 }}></div>

        {isLoading && (
          <div style={{ textAlign: "center", fontSize: "18px" }}>
            Đang tải dữ liệu...
          </div>
        )}
        {!isLoading && (
          <>
            {statType === "yearly" && (
              <>
                <YearlyRevenueChart data={chartData} />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 20,
                  }}
                >
                  {yearsOfPropor.map((year) => {
                    console.log("yearsOfPropor tại year", yearsOfPropor[year]);
                    return (
                      <CateRevenueChart
                        key={year}
                        data={chartDataPropor[year]}
                        year={year}
                        color={cateColors}
                      ></CateRevenueChart>
                    );
                  })}
                </div>
              </>
            )}
            {statType === "monthly" && (
              <MonthlyRevenueChart data={chartData} year={selectedYear} />
            )}
            {statType === "quarterly" && (
              <QuarterlyRevenueChart data={chartData} year={selectedYear} />
            )}
            {statType === "customRange" && (
              <DailyRevenueRangeChart
                data={chartData}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsDashboard;
