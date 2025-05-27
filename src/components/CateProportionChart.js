import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CateRevenueChart = ({ data, year, color }) => {
  // const dataFake = [
  //   { cate: "ao", quantity: 30000 },
  //   { cate: "quần", quantity: 20000 },
  //   { cate: "váy", quantity: 50000 },
  //   { cate: "phụ kiện", quantity: 40000 },
  //   { cate: "giày", quantity: 60000 },
  // ];
  console.log("data: " + data);

  const validData = data;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.45; // Vị trí của nhãn
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(2)}%`}
        {/* Bạn có thể hiển thị name ở đây nếu muốn: {name} - {(percent * 100).toFixed(0)}% */}
      </text>
    );
  };

  if (!validData || validData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Không có dữ liệu để hiển thị biểu đồ tròn.
      </div>
    );
  }
  console.log(validData);

  const totalPercent = validData.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );

  return (
    <div style={{ width: 350, height: 350, marginTop: 100 }}>
      <h3 style={{ textAlign: "center" }}>Tỉ lệ bán ra năm {year}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={validData}
            cx={"50%"}
            cy={"45%"}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={130}
            innerRadius={50}
            fill="#8884d8"
            dataKey={"quantity"}
            nameKey={"cate"}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color[entry.cate]}></Cell>
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              let percentDisplay = "N/A";

              if (totalPercent > 0) {
                const currentSliceValue = value;
                percentDisplay = (
                  (currentSliceValue / totalPercent) *
                  100
                ).toFixed(2);
              }

              return [`${value} (${percentDisplay}%)`, name];
            }}
          ></Tooltip>
          <Legend
            layout="vertical"
            verticalAlign="bottom"
            height={35}
            wrapperStyle={{ fontSize: 15, marginBottom: 20 }}
          ></Legend>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CateRevenueChart;
