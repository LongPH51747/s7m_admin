import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Button, message } from 'antd';
import { registerShipper } from '../services/shipperService';

const AddShipperModal = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: registerShipper,
        onSuccess: () => {
            message.success('Tạo tài khoản shipper mới thành công!');
            queryClient.invalidateQueries({ queryKey: ['shippers'] });
            onClose();
            form.resetFields();
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra khi tạo shipper.';
            message.error(errorMessage);
        },
    });

    const handleCreateShipper = () => {
        form.validateFields()
            .then(values => {
                const payload = {
                    ...values,
                    post_office: values.post_office || "", 
                };
                mutation.mutate(payload);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Tạo Tài Khoản Shipper Mới"
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={mutation.isPending}
                    onClick={handleCreateShipper}
                >
                    Tạo
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="add_shipper_form">
                <Form.Item
                    name="name"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input placeholder="Ví dụ: Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                    name="user_name"
                    label="Tên đăng nhập (Username)"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input placeholder="Ví dụ: nva_shipper" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu an toàn" />
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="Ví dụ: 0987654321" />
                </Form.Item>

                <Form.Item
                    name="post_office"
                    label="ID Bưu cục (Tùy chọn)" 
                >
                    <Input placeholder="Nhập ID của bưu cục (nếu có)" />
                </Form.Item>
               
                <Form.Item
                    name="address_shipping"
                    label="Địa chỉ kho/Lấy hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ kho!' }]}
                >
                    <Input placeholder="Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddShipperModal;