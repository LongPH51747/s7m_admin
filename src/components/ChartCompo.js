import {
  CartesianAxis,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyVND } from "../untils";

const ChartCompo = ({data, name, time}) => {
    const dataDoanhThu = [
    { month: 1, price: 2000 },
    { month: 2, price: 4000 },
    { month: 3, price: 6000 },
    { month: 4, price: 3000 },
    { month: 5, price: 2000 },
    { month: 6, price: 5000 },
    { month: 7, price: 8000 },
    { month: 8, price: 3000 },
    { month: 9, price: 10000 },
    { month: 10, price: 4000 },
    { month: 11, price: 6000 },
    { month: 12, price: 12000 },
  ];

  const chartData = data && data.length > 0 ? data : dataDoanhThu;

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 40,
            left: 70,
            bottom: 20,
          }}
        >
          <CartesianAxis
            strokeDasharray={"4 4"}
            stroke="#e0e0e0"
          ></CartesianAxis>
          <XAxis dataKey="thang" tick={{ fontSize: 13 }}>
            <Label
              value={time}
              offset={-15}
              position={"insideBottom"}
              style={{ fontSize: 14, fill: "#333" }}
            ></Label>
          </XAxis>
          <YAxis
            tickFormatter={formatCurrencyVND}
            tick={{ fontSize: 11 }}
            domain={["auto", "auto"]}
          >
            <Label value={'doanh thu'} angle={0} position={'insideTop'} style={{fontSize: 14, fill: '#333'}} offset={-50}/>
          </YAxis>
          <Tooltip formatter={(value, name, props) => [formatCurrencyVND(value), 'doanh thu']}></Tooltip>
          <Legend verticalAlign="top" height={35} wrapperStyle={{fontSize: '15px'}}></Legend>
          <Line 
          type={'monotone'}
          dataKey={'doanhthu'}
          stroke="#e0e0e0"
          strokeWidth={2.5}
          activeDot={{r: 5, strokeWidth: 2, fill: '#007bf'}}
          dot = {{stroke: '#0056b3', strokeWidth: 1, r: 3}}
          name= {name}
          ></Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartCompo