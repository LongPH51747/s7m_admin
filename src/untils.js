export const formatCurrencyVND = (value) => {
  if (value == null || isNaN(value)) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function parseDate(dateString) {
  // dateString format: "D/M/YYYY"
  const parts = dateString.split("/");
  // Lưu ý: tháng trong JavaScript Date object là từ 0 (Tháng 1) đến 11 (Tháng 12)
  return new Date(
    parseInt(parts[2]),
    parseInt(parts[1]) - 1,
    parseInt(parts[0])
  );
}

// utils/colorGenerator.js
export const generateHSLRainbowColor = (
  index,
  totalItems,
  saturation = 50,
  lightness = 45
) => {
  const hue = (index * (360 / totalItems)) % 360 - 55;
  console.log(hue);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Ví dụ sử dụng:
// const myDate = parseDate("6/11/2023"); // Sẽ tạo ra đối tượng Date cho ngày 6 tháng 11 năm 2023

export const createColorMap = (multiYearData) => {
  const allCateNames = new Set();

  if (multiYearData && typeof multiYearData === "object") {
    Object.values(multiYearData).forEach((yearEntries) => {
      if (Array.isArray(yearEntries)) {
        yearEntries.forEach((entry) => {
          if (entry && typeof entry.cate !== "undefined") {
            allCateNames.add(entry.cate);
            console.log("cate: ",entry.cate);
          } else {
            console.log("mục entry không hợp lệ: " + entry);
          }
        });
      } else {
        console.log("dữ liệu không phải mảng");
      }
    });
  }
  else {
    console.log("mutiYearData không hợp lệ: ", multiYearData);
  }

  console.log("allCateNames", allCateNames);
  

  const uniqueCateSort = Array.from(allCateNames).sort();

  console.log("uniqCateSort", uniqueCateSort);
  

  const cateColors = {};

  uniqueCateSort.forEach((cateName, index) => {
    cateColors[cateName] = generateHSLRainbowColor(index, uniqueCateSort.length);
  });

  console.log("cateColors", cateColors);
  

  return { uniqCates: uniqueCateSort, cateColors };
};
