import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { registerShipper } from '../services/shipperService';
import { getAllPostOffices } from '../services/postOfficeService';

const { Option } = Select;

const AddShipperModal = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: postOffices, isLoading: isLoadingPostOffices } = useQuery({
        queryKey: ['postOffices'],
        queryFn: getAllPostOffices,
        enabled: isOpen,
    });

    const mutation = useMutation({
        mutationFn: registerShipper,
        onSuccess: () => {
            message.success('Tạo tài khoản shipper mới thành công!');
            queryClient.invalidateQueries({ queryKey: ['shippers'] });
            onClose();
            form.resetFields();
        },
        onError: (error) => message.error(error.response?.data?.message || 'Đã có lỗi xảy ra.'),
    });

    const handleCreateShipper = () => {
        form.validateFields().then(values => {
            mutation.mutate(values);
        });
    };

    // --- HÀM MỚI ĐỂ XỬ LÝ VIỆC TỰ ĐỘNG ĐIỀN ĐỊA CHỈ ---
    const handlePostOfficeChange = (value) => {
        if (value) {
            // `value` ở đây là `_id` của bưu cục được chọn
            // Tìm đối tượng bưu cục tương ứng trong danh sách đã fetch
            const selectedOffice = postOffices?.find(office => office._id === value);
            if (selectedOffice) {
                // Sử dụng `form.setFieldsValue` để cập nhật trường 'address_shipping'
                form.setFieldsValue({
                    address_shipping: selectedOffice.address_post_office
                });
            }
        } else {
            // Nếu người dùng xóa lựa chọn (allowClear), thì cũng xóa địa chỉ
            form.setFieldsValue({
                address_shipping: ''
            });
        }
    };
    
    return (
        <Modal
            title="Tạo Tài Khoản Shipper Mới"
            open={isOpen}
            onCancel={onClose}
            onOk={handleCreateShipper}
            confirmLoading={mutation.isPending}
        >
            <Form form={form} layout="vertical" name="add_shipper_form">
                <Form.Item name="name" label="Họ và Tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="user_name" label="Tên đăng nhập" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="phone_number" label="Số điện thoại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                
                {/* CẬP NHẬT SELECT VỚI SỰ KIỆN `onChange` */}
                <Form.Item name="post_office" label="Bưu Cục" rules={[{ required: true }]} > 
                    <Select
                        placeholder="Chọn bưu cục cho shipper"
                        loading={isLoadingPostOffices}
                        allowClear
                        onChange={handlePostOfficeChange} 
                    >
                        {postOffices?.map(office => (
                            <Option key={office._id} value={office._id}>
                                {office.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
               
                <Form.Item name="address_shipping" label="Địa chỉ kho/Lấy hàng" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddShipperModal;