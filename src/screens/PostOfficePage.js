// src/screens/PostOfficePage.js

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Spin, Alert, Typography } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { getAllPostOffices } from '../services/postOfficeService';
import PostOfficeModal from '../components/PostOfficeModal'; 

const { Title } = Typography;

const PostOfficePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostOffice, setEditingPostOffice] = useState(null); // State để lưu thông tin bưu cục đang sửa

  const { data: postOffices, isLoading, isError, error } = useQuery({
    queryKey: ['postOffices'],
    queryFn: getAllPostOffices,
  });

  const handleOpenCreateModal = () => {
    setEditingPostOffice(null); // Đảm bảo không có dữ liệu cũ
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (postOffice) => {
    setEditingPostOffice(postOffice); // Truyền dữ liệu bưu cục vào modal
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Tên Bưu Cục', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address_post_office', key: 'address' },
    { title: 'Kinh độ (Longitude)', dataIndex: 'longitude', key: 'lon' },
    { title: 'Vĩ độ (Latitude)', dataIndex: 'latitude', key: 'lat' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleOpenEditModal(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  if (isLoading) return <Spin />;
  if (isError) return <Alert message="Lỗi tải dữ liệu" description={error.message} type="error" />;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2} style={{ margin: 0 }}>Quản Lý Bưu Cục</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal}>
          Thêm Bưu Cục Mới
        </Button>
      </div>
      <Table columns={columns} dataSource={postOffices} rowKey="_id" bordered />
      {isModalOpen && (
        <PostOfficeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingPostOffice}
        />
      )}
    </div>
  );
};

export default PostOfficePage;