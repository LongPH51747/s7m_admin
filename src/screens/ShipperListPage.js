// src/screens/ShipperListPage.js

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Import các component cần thiết từ thư viện Ant Design
import { Table, Button, Spin, Alert, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// Import các hàm gọi API và component con
import { getAllShippers } from '../services/shipperService';
import AddShipperModal from '../components/AddShipperModal'; // Lưu ý: component này cũng cần được cập nhật

const { Title } = Typography;

const ShipperListPage = () => {
    // State để quản lý việc bật/tắt modal thêm mới
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Hook để điều hướng trang
    const navigate = useNavigate();

    // Sử dụng React Query để fetch và quản lý dữ liệu shipper
    const { data: shippers, isLoading, isError, error } = useQuery({
        queryKey: ['shippers'], 
        queryFn: getAllShippers,
    });

    // Định nghĩa cấu trúc các cột cho bảng Ant Design, đã được cập nhật
    const columns = [
        {
            title: 'Họ và Tên',
            dataIndex: 'name', // Cập nhật theo backend: `name`
            key: 'name',
            // Render tên dưới dạng một link có thể nhấn vào
            render: (text, record) => (
                <Button 
                    type="link" 
                    onClick={() => navigate(`/shippers/${record._id}`)} // Điều hướng đến trang chi tiết
                >
                    {text}
                </Button>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number', // Cập nhật theo backend: `phone_number`
            key: 'phone_number',
        },
        {
            title: 'Khu vực giao',
            dataIndex: 'address_shipping', // Cập nhật theo backend: `post_office`
            key: 'address_shipping',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status', // Cập nhật theo backend: `status` (boolean)
            // Cập nhật bộ lọc để sử dụng giá trị boolean
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Không hoạt động', value: false },
            ],
            onFilter: (value, record) => record.status === value,
            // Cập nhật hàm render để xử lý giá trị boolean
            render: (status) => {
                const isActive = status === true; // Kiểm tra trạng thái boolean
                const color = isActive ? 'green' : 'volcano';
                const text = isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG';
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    // Giao diện khi dữ liệu đang được tải
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Giao diện khi có lỗi xảy ra
    if (isError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Lỗi Tải Dữ Liệu"
                    description={error.message || 'Không thể kết nối đến máy chủ.'}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Giao diện chính
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Quản Lý Shipper</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm Shipper Mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={shippers}
                rowKey="_id"
                bordered
                scroll={{ x: 'max-content' }}
            />

            {/* Modal để thêm shipper mới */}
            {isModalOpen && (
                <AddShipperModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ShipperListPage;