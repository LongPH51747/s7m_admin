import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Button, message } from 'antd';
import { registerShipper } from '../services/shipperService'; // Giả sử hàm này đã được tạo

const AddShipperModal = ({ isOpen, onClose }) => {
    // Hook của Ant Design để điều khiển form
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    // Sử dụng useMutation để xử lý logic gọi API tạo shipper
    const mutation = useMutation({
        mutationFn: registerShipper, // Hàm API sẽ được gọi
        onSuccess: () => {
            // Khi API trả về thành công
            message.success('Tạo tài khoản shipper mới thành công!');
            // Quan trọng: Vô hiệu hóa query 'shippers' để React Query tự động fetch lại danh sách mới
            queryClient.invalidateQueries({ queryKey: ['shippers'] });
            onClose(); // Đóng modal
            form.resetFields(); // Xóa sạch các trường trong form
        },
        onError: (error) => {
            // Khi API trả về lỗi
            // Cố gắng hiển thị lỗi từ server, nếu không có thì hiển thị lỗi mặc định
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra khi tạo shipper.';
            message.error(errorMessage);
        },
    });

    // Hàm xử lý khi người dùng nhấn nút "Tạo"
    const handleCreateShipper = () => {
        form.validateFields()
            .then(values => {
                // `values` là một object chứa tất cả dữ liệu từ form
                // Ví dụ: { name: '...', user_name: '...', ... }
                // Gọi mutation để thực thi việc tạo shipper
                mutation.mutate(values);
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
            // Tùy chỉnh footer để có nút "Tạo" với trạng thái loading
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={mutation.isPending} // Nút sẽ có icon loading khi đang gọi API
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
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của shipper!' }]}
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
                    label="Khu vực giao (Bưu cục)"
                    rules={[{ required: true, message: 'Vui lòng nhập khu vực giao!' }]}
                >
                    <Input placeholder="Ví dụ: 64cfa8b76e2b3c1a4f2f9b11 (ID Bưu cục)" />
                    {/* LƯU Ý: Nếu `post_office` là một Dropdown/Select thì bạn cần thay đổi Input này */}
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