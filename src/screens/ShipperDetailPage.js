// src/screens/ShipperDetailPage.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Alert, Row, Col, Card, Descriptions, Table, Tag, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';

// Import các hàm gọi API
import { getShipperById } from '../services/shipperService';
import { getAllOrder } from '../services/orderService';

// Import các map trạng thái và màu sắc
import { statusMap, statusColors } from '../utils/StatusColors';

const { Title } = Typography;

const ShipperDetailPage = () => {
    const { shipperId } = useParams();
    const navigate = useNavigate();

    // Query 1: Lấy thông tin chi tiết của shipper
    const { data: shipper, isLoading: isLoadingShipper } = useQuery({
        queryKey: ['shipper', shipperId],
        queryFn: () => getShipperById(shipperId),
        enabled: !!shipperId,
    });

    // Query 2: Lấy tất cả đơn hàng
    const { data: allOrders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrder,
    });

    // Lọc các đơn hàng của shipper và sắp xếp theo ngày cập nhật mới nhất
    const shipperOrders = allOrders?.filter(order => order.shipper === shipperId) || [];
    const sortedOrders = [...shipperOrders].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

   const orderColumns = [
        {
            title: 'Mã Đơn',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <Button type="link" onClick={() => navigate(`/orders/SMT${id}`)}>{`SMT${id}`}</Button>
        },
        {
            title: 'Ngày Cập Nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Tiền thu hộ',
            dataIndex: 'total_amount',
            key: 'total_amount',
            // LOGIC MỚI: Chỉ hiển thị tiền nếu phương thức thanh toán là COD
            render: (amount, record) => {
                if (record.payment_method === 'MOMO') {
                    return '0 VND';
                }
                return `${(amount || 0).toLocaleString()} VND`;
            }
        },
        {
            title: 'Phương Thức Thanh Toán',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => <Tag color={method === 'Momo' ? 'blue' : 'green'}>{method}</Tag>
        },
        {
            title: 'Trạng Thái Đơn',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusText = statusMap[status] || 'Không rõ';
                const colorClass = statusColors[statusText] || 'bg-gray-200';
                const tagColor = colorClass.includes('green') ? 'success' :
                    colorClass.includes('blue') ? 'processing' :
                        colorClass.includes('yellow') ? 'warning' :
                            colorClass.includes('red') ? 'error' :
                                'default';
                return <Tag color={tagColor}>{statusText}</Tag>;
            }
        },
    ];

    const isLoading = isLoadingShipper || isLoadingOrders;

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '16px', fontWeight: 'bold' }}
            >
                Quay lại
            </Button>
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
                                <Descriptions.Item label="Khu vực giao">{shipper.address_shipping || 'Chưa có'}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    <Tag color={shipper.status ? 'red' : 'green'}>
                                        {shipper.status ? 'KHÔNG HOẠT ĐỘNG' : 'HOẠT ĐỘNG'}
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
                            dataSource={sortedOrders}
                            rowKey="_id"
                            bordered
                            locale={{ emptyText: 'Chưa có đơn hàng nào' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShipperDetailPage;