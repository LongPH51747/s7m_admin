import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Radio, DatePicker, Input, Button, Table, Typography, Spin, Alert, Tag, Select, Space } from 'antd';
import moment from 'moment';

// Import các hàm API
import {
  getTopSpendersByMonth,
  getTopSpendersYearly,
  getTopSpendersQuarterly,
  getTopSpendersByCustomRange,
  getTopBuyersByItemQuantityMonthly,
  getTopBuyersByItemQuantityYearly,
  getTopBuyersByItemQuantityQuarterly,
  getTopBuyersByItemQuantityDateRange,
} from "../services/statisticUserService";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const UserStatistics = () => {
  const navigate = useNavigate();

  const [metric, setMetric] = useState("totalSpent");
  const [period, setPeriod] = useState("month");
  const [limit, setLimit] = useState(10);
  const [limitInput, setLimitInput] = useState("10");
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedYear, setSelectedYear] = useState(moment());
  const [selectedQuarter, setSelectedQuarter] = useState(moment().quarter());

  // `useQuery` sẽ tự động chạy lại khi các state trong `queryKey` thay đổi
  const { data: stats = [], isLoading, isError, error } = useQuery({
    queryKey: ['userStatistics', { metric, period, limit, dateRange, selectedMonth, selectedYear, selectedQuarter }],
    
    queryFn: async () => {
      // Chỉ truyền `limit` vào các API có hỗ trợ
      const numericLimit = limit > 0 ? limit : undefined;

      switch (period) {
        case 'month': {
          if (!selectedMonth) return [];
          const year = selectedMonth.year();
          const month = selectedMonth.month() + 1;
          if (metric === 'totalSpent') return getTopSpendersByMonth(year, month, numericLimit);
          if (metric === 'totalQuantity') return getTopBuyersByItemQuantityMonthly(year, month, numericLimit);
          break;
        }
        case 'quarter': {
          if (!selectedYear) return [];
          const year = selectedYear.year();
          if (metric === 'totalSpent') return getTopSpendersQuarterly(year, selectedQuarter, numericLimit);
          if (metric === 'totalQuantity') return getTopBuyersByItemQuantityQuarterly(year, selectedQuarter, numericLimit);
          break;
        }
        case 'year': {
          if (!selectedYear) return [];
          const year = selectedYear.year();
          // API theo năm không có tham số limit
          if (metric === 'totalSpent') return getTopSpendersYearly(year);
          if (metric === 'totalQuantity') return getTopBuyersByItemQuantityYearly(year);
          break;
        }
        case 'custom': {
          const [startDate, endDate] = dateRange;
          if (!startDate || !endDate) return [];
          const formattedStartDate = startDate.format('YYYY-MM-DD');
          const formattedEndDate = endDate.format('YYYY-MM-DD');
          if (metric === 'totalSpent') return getTopSpendersByCustomRange(formattedStartDate, formattedEndDate, numericLimit);
          if (metric === 'totalQuantity') return getTopBuyersByItemQuantityDateRange(formattedStartDate, formattedEndDate, numericLimit);
          break;
        }
        default:
          return [];
      }
    },
    enabled: !(period === 'custom' && (!dateRange || !dateRange[0] || !dateRange[1])),
  });
  
  // Xử lý dữ liệu sau khi fetch về, áp dụng limit cho các API không hỗ trợ
  const processedStats = React.useMemo(() => {
    if (period === 'year' && limit > 0) {
      return stats.slice(0, limit);
    }
    return stats;
  }, [stats, period, limit]);

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/users/${record.userId}/orders`)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
      align: 'center',
    },
    {
      title: metric === 'totalSpent' ? 'Tổng tiền mua hàng (VND)' : 'Tổng sản phẩm đã mua',
      dataIndex: metric === 'totalSpent' ? 'totalSpent' : 'totalQuantityPurchased',
      key: 'metric',
      align: 'center',
      sorter: (a, b) => (a[metric === 'totalSpent' ? 'totalSpent' : 'totalQuantityPurchased'] || 0) - (b[metric === 'totalSpent' ? 'totalSpent' : 'totalQuantityPurchased'] || 0),
      render: (value) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
          {metric === 'totalSpent' ? (value || 0).toLocaleString('vi-VN') : (value || 0)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          onClick={() => (record)}
        >
          Tặng Voucher
        </Button>
      ),
    },
  ];

  // Component render các ô chọn thời gian
  const renderTimePickers = () => {
    return (
      <Space>
        {period === 'month' && (
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Chọn tháng"
          />
        )}
        {period === 'quarter' && (
          <>
            <DatePicker
              picker="year"
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Chọn năm"
            />
            <Select value={selectedQuarter} onChange={setSelectedQuarter} style={{ width: 120 }}>
              <Option value={1}>Quý 1</Option>
              <Option value={2}>Quý 2</Option>
              <Option value={3}>Quý 3</Option>
              <Option value={4}>Quý 4</Option>
            </Select>
          </>
        )}
        {period === 'year' && (
          <DatePicker
            picker="year"
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Chọn năm"
          />
        )}
        {period === 'custom' && (
          <RangePicker value={dateRange} onChange={setDateRange} />
        )}
      </Space>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📊 Thống kê người dùng</Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: 8, fontWeight: 500 }}>Thống kê theo:</label>
            <Radio.Group value={metric} onChange={(e) => setMetric(e.target.value)}>
              <Radio.Button value="totalSpent">💰 Tổng tiền mua hàng</Radio.Button>
              <Radio.Button value="totalQuantity">📦 Tổng sản phẩm</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <label style={{ marginRight: 8, fontWeight: 500 }}>Giai đoạn:</label>
            <Radio.Group value={period} onChange={(e) => setPeriod(e.target.value)}>
              <Radio.Button value="month">Theo tháng</Radio.Button>
              <Radio.Button value="quarter">Theo quý</Radio.Button>
              <Radio.Button value="year">Theo năm</Radio.Button>
              <Radio.Button value="custom">Tùy chọn</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {renderTimePickers()}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <label style={{ marginRight: 8, fontWeight: 500 }}>Hiển thị Top:</label>
            <Input
              type="number"
              min="0"
              placeholder="Tất cả"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              style={{ width: 100 }}
            />
            <Button type="primary" onClick={() => setLimit(Number(limitInput))} style={{ marginLeft: 8 }}>
              Áp dụng
            </Button> */}
          </div>
        </div>
      </div>
      
      {isLoading ? <Spin /> : isError ? <Alert message="Lỗi" description={error.message} type="error" /> : (
        <Table
          columns={columns}
          dataSource={processedStats}
          rowKey="userId"
          bordered
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      )}
    </div>
  );
};

export default UserStatistics;