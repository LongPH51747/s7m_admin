// src/screens/ReturnRequestPage.js

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Spin, Alert, Typography, Tag, Image } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

// Import các service cần thiết
import { getAllReturnRequests } from '../services/returnRequestService';
import { getAllUsers } from '../services/userServices';
import { statusMap, statusColors } from '../utils/StatusColors';
import { API_BASE } from '../services/LinkApi';

const { Title } = Typography;

// Hàm helper để lấy màu cho Tag AntD từ class TailwindCSS
const getTagColor = (statusText) => {
  const colorClass = statusColors[statusText] || '';
  if (colorClass.includes('green')) return 'success';
  if (colorClass.includes('blue')) return 'processing';
  if (colorClass.includes('yellow') || colorClass.includes('amber')) return 'warning';
  if (colorClass.includes('orange')) return 'warning';
  if (colorClass.includes('red')) return 'error';
  return 'default';
};

const ReturnRequestPage = () => {
  const navigate = useNavigate();

  // Query để lấy danh sách yêu cầu trả hàng
  const { data: requests, isLoading: isLoadingRequests, isError: isErrorRequests, error: errorRequests } = useQuery({
    queryKey: ['returnRequests'],
    queryFn: getAllReturnRequests,
  });

  // Query để lấy danh sách tất cả người dùng
  const { data: users = [], isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  // Hàm helper để tìm tên người dùng từ `userId` (dạng chuỗi)
  const getUserFullname = (userId) => {
    if (typeof userId === 'string') {
      const user = users.find(u => u._id === userId);
      return user?.fullname || 'Không rõ';
    }
    // Phòng trường hợp API trả về object đã được populate
    return userId?.fullname || 'Không rõ';
  };

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (order) => {
        const orderIdString = order?._id || order;
        if (!orderIdString || typeof orderIdString !== 'string') return 'N/A';

        return (
          <Button type="link" onClick={() => navigate(`/return-details/SMT${orderIdString}`)}>
            {`...${orderIdString.slice(-8).toUpperCase()}`}
          </Button>
        );
      }
    },
    {
      title: 'Người Yêu Cầu',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => getUserFullname(userId),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images', 
      key: 'images',
      render: (images) => {
        if (images && images.length > 0) {
          // Lấy URL của ảnh đầu tiên
          const imageUrl = images[0];
          // Tạo URL hoàn chỉnh bằng cách nối với API_BASE
          const fullImageUrl = `${API_BASE}${imageUrl}`;

          return <Image width={60} src={fullImageUrl} alt="Hình ảnh minh chứng" />;
        } else {
          return 'Không có';
        }
      },
    },
    {
      title: 'Ngày Yêu Cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusText = statusMap[status] || status;
        return <Tag color={getTagColor(statusText)}>{statusText}</Tag>;
      },
    },
  ];

  // Đảm bảo chờ cả hai API hoàn thành trước khi render bảng
  const isLoading = isLoadingRequests || isLoadingUsers;
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const isError = isErrorRequests || isErrorUsers;
  const error = errorRequests || errorUsers;
  if (isError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Lỗi tải dữ liệu" description={error.message} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ margin: 0, marginBottom: '16px' }}>Lịch sử hoàn trả hàng</Title>

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="_id"
        bordered
        locale={{ emptyText: 'Chưa có yêu cầu trả hàng nào' }}
      />
    </div>
  );
};

export default ReturnRequestPage;