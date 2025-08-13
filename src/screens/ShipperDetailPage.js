// src/screens/ShipperDetailPage.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Alert, Row, Col, Card, Descriptions, Table, Tag, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// Import các hàm gọi API cần thiết
import { getShipperById } from '../services/shipperService';
import { getAllOrder } from '../services/orderService'; // <-- Sử dụng hàm API hiện có của bạn

const { Title } = Typography;

const ShipperDetailPage = () => {
    // Lấy shipperId từ URL
    const { shipperId } = useParams();
    const navigate = useNavigate();

    // Query 1: Lấy thông tin chi tiết của shipper (giữ nguyên)
    const { data: shipper, isLoading: isLoadingShipper } = useQuery({
        queryKey: ['shipper', shipperId],
        queryFn: () => getShipperById(shipperId),
        enabled: !!shipperId,
    });

    // Query 2: Lấy TẤT CẢ đơn hàng từ hệ thống
    const { data: allOrders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['orders'], // Key chung cho tất cả đơn hàng
        queryFn: getAllOrder, // <-- Gọi hàm getAllOrder của bạn
    });

    // --- PHẦN LỌC DỮ LIỆU ---
    // Lọc danh sách `allOrders` để chỉ lấy những đơn hàng của shipper này
    // Lưu ý: Hãy chắc chắn rằng trong đối tượng `order` của bạn có một trường để xác định shipper,
    // ví dụ như `shipper._id` hoặc `shipperId`. Tôi sẽ giả định là `shipper`
    const shipperOrders = allOrders?.filter(order => order.shipper === shipperId) || [];

    // Cấu hình cột cho bảng đơn hàng
    const orderColumns = [
        { 
            title: 'Mã Đơn', 
            dataIndex: '_id', 
            key: '_id',
            // Render dưới dạng link đến chi tiết đơn hàng
            render: (id) => <Button type="link" onClick={() => navigate(`/orders/SMT${id}`)}>{`SMT${id}`}</Button>
        },
        { 
            title: 'Ngày Cập Nhật', 
            dataIndex: 'updatedAt', 
            key: 'updatedAt', 
            render: (date) => new Date(date).toLocaleDateString() 
        },
        { 
            title: 'Tổng Tiền', 
            dataIndex: 'total_amount', 
            key: 'total_amount', 
            render: (amount) => `${(amount || 0).toLocaleString()} VND` 
        },
        { 
            title: 'Trạng Thái Đơn', 
            dataIndex: 'status', 
            key: 'status', 
            // Giả định `status` là số, bạn có thể thay đổi logic này
            render: (status) => {
                const statusMap = { 3: 'Giao thành công', 4: 'Đã nhận hàng', 5: 'Hoàn hàng' };
                const colorMap = { 3: 'blue', 4: 'green', 5: 'red' };
                return <Tag color={colorMap[status] || 'default'}>{statusMap[status] || 'Không rõ'}</Tag>;
            }
        },
    ];

    const isLoading = isLoadingShipper || isLoadingOrders;

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/shippers')}
                style={{ marginBottom: '20px' }}
            >
                Quay Lại Danh Sách
            </Button> */}
            
            <Row gutter={[24, 24]}>
                {/* Thông tin shipper */}
                <Col span={24}>
                    <Card title="Thông Tin Chi Tiết Shipper">
                        {shipper ? (
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="ID">{shipper._id}</Descriptions.Item>
                                <Descriptions.Item label="Tên Shipper">{shipper.name}</Descriptions.Item>
                                <Descriptions.Item label="Username">{shipper.user_name}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{shipper.phone_number}</Descriptions.Item>
                                <Descriptions.Item label="Khu vực giao"> {shipper?.post_office?.name}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    <Tag color={shipper.status ? 'green' : 'red'}>
                                        {shipper.status ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <Alert message="Không tìm thấy thông tin shipper này." type="warning" />
                        )}
                    </Card>
                </Col>

                {/* Danh sách đơn hàng đã giao */}
                <Col span={24}>
                    <Card>
                        <Title level={4}>Các Đơn Hàng Liên Quan</Title>
                        <Table
                            columns={orderColumns}
                            dataSource={shipperOrders} // <-- Sử dụng dữ liệu đã được lọc
                            rowKey="_id"
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShipperDetailPage;