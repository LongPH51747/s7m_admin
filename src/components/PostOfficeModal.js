// src/components/PostOfficeModal.js

import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';
import { createPostOffice, updatePostOffice } from '../services/postOfficeService';

const PostOfficeModal = ({ isOpen, onClose, initialData }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form, isEditing]);

  const mutation = useMutation({
    mutationFn: isEditing ? updatePostOffice : createPostOffice,
    onSuccess: () => {
      message.success(isEditing ? 'Cập nhật bưu cục thành công!' : 'Tạo bưu cục mới thành công!');
      queryClient.invalidateQueries({ queryKey: ['postOffices'] });
      onClose();
    },
    onError: (error) => message.error(error.response?.data?.message || 'Đã có lỗi xảy ra.'),
  });

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (isEditing) {
          mutation.mutate({ id: initialData._id, postOfficeData: values });
        } else {
          mutation.mutate(values);
        }
      });
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh Sửa Bưu Cục' : 'Tạo Bưu Cục Mới'}
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={mutation.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên Bưu Cục" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address_post_office" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="longitude" label="Kinh độ (Longitude)" rules={[{ required: true, type: 'number' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="latitude" label="Vĩ độ (Latitude)" rules={[{ required: true, type: 'number' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostOfficeModal;