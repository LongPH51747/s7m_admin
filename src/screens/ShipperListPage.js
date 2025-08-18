// src/screens/ShipperListPage.js

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Import các component cần thiết từ thư viện Ant Design
import { Table, Button, Spin, Alert, Tag, Typography, Space } from 'antd'; // 1. Import Space
import { PlusOutlined, EditOutlined } from '@ant-design/icons'; // 2. Import EditOutlined

// Import các hàm gọi API và component con
import { getAllShippers } from '../services/shipperService';
import AddShipperModal from '../components/AddShipperModal';

const { Title } = Typography;

const ShipperListPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const { data: shippers, isLoading, isError, error } = useQuery({
        queryKey: ['shippers'], 
        queryFn: getAllShippers,
    });

    const columns = [
        {
            title: 'Họ và Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button 
                    type="link" 
                    onClick={() => navigate(`/shippers/${record._id}`)}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Khu vực giao',
            dataIndex: 'post_office',
            key: 'post_office',
            render: (postOffice) => {
                // Nếu postOffice là object và có thuộc tính `name`, thì hiển thị `name`
                if (typeof postOffice === 'object' && postOffice !== null && postOffice.name) {
                    return postOffice.name;
                }
                // Nếu nó là chuỗi hoặc một dạng khác, hiển thị chính nó
                if (typeof postOffice === 'string' && postOffice) {
                    return postOffice;
                }
                // Trường hợp không có dữ liệu
                return 'Chưa có';
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Không hoạt động', value: false },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const isActive = status === true;
                const color = isActive ? 'green' : 'volcano';
                const text = isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG';
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

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

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Quản Lý Shipper</Title>
                
                {/* 3. SỬA ĐỔI KHU VỰC NÚT BẤM */}
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate('/post-offices')} // Điều hướng đến trang quản lý bưu cục
                    >
                        Quản lý Bưu cục
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Thêm Shipper Mới
                    </Button>
                </Space>
                {/* --------------------------- */}
            </div>

            <Table
                columns={columns}
                dataSource={shippers}
                rowKey="_id"
                bordered
                scroll={{ x: 'max-content' }}
            />

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