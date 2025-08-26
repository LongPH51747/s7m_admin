// src/components/CreateVoucherModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const CreateVoucherModal = ({ user, visible, onClose, onVoucherCreated }) => {
    const [code, setCode] = useState('');
    const [type, setType] = useState('percentage');
    const [value, setValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState(null); // State để hiển thị thông báo

    // Reset form và message khi modal được mở hoặc đóng
    useEffect(() => {
        if (visible) {
            setCode('');
            setType('percentage');
            setValue('');
            setMinOrderValue('');
            setMaxDiscount('');
            setStartDate('');
            setEndDate('');
            setMessage(null);
        }
    }, [visible]);

    const handleCreatePrivateVoucher = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!code || !value || !minOrderValue || !startDate || !endDate) {
            setMessage({ type: 'error', text: 'Lỗi: Vui lòng điền đầy đủ thông tin.' });
            return;
        }

        // Kiểm tra thêm cho loại voucher percentage
        if (type === 'percentage' && !maxDiscount) {
            setMessage({ type: 'error', text: 'Lỗi: Vui lòng nhập giá trị giảm tối đa.' });
            return;
        }

        const payload = {
            code,
            type,
            value: Number(value),
            minOrderValue: Number(minOrderValue),
            startDate,
            endDate,
            quantity: 1, // Số lượng được cố định là 1 cho voucher riêng tư
            isPublic: false,
            userId: user.userId,
        };

        // Chỉ thêm maxDiscount vào payload nếu type là 'percentage'
        if (type === 'percentage') {
            payload.maxDiscount = Number(maxDiscount);
        }

        try {
            const response = await axios.post(ENDPOINTS.CREATE_VOUCHER, payload);

            if (response.status === 200) {
                setMessage({ type: 'success', text: `Thành công: Voucher đã được tạo cho ${user.fullname}` });
                if (onVoucherCreated) {
                    onVoucherCreated();
                }
                setTimeout(() => {
                    onClose();
                }, 2000); // Tự động đóng sau 2 giây
            } else {
                setMessage({ type: 'error', text: `Lỗi: ${response.data.message || 'Không thể tạo voucher.'}` });
            }
        } catch (error) {
            console.error("Lỗi khi tạo voucher:", error.response?.data || error.message);
            setMessage({ type: 'error', text: `Lỗi: Đã xảy ra lỗi khi tạo voucher. Vui lòng thử lại.` });
        }
    };
    
    // Nếu visible là false, không render gì cả
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold">Tạo Voucher cho {user?.fullname}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                
                {message && (
                    <div className={`p-3 mb-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Mã Code:</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Loại:</label>
                        <select 
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={type} 
                            onChange={(e) => {
                                setType(e.target.value);
                                setMaxDiscount('');
                            }}
                        >
                            <option value="percentage">Phần trăm</option>
                            <option value="fixed">Cố định</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Giá trị:</label>
                        <input 
                            type="number" 
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={value} 
                            onChange={(e) => setValue(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Giá trị đơn hàng tối thiểu:</label>
                        <input 
                            type="number" 
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={minOrderValue} 
                            onChange={(e) => setMinOrderValue(e.target.value)} 
                        />
                    </div>

                    {type === 'percentage' && (
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm font-medium">Giá trị giảm tối đa:</label>
                            <input 
                                type="number" 
                                className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                value={maxDiscount} 
                                onChange={(e) => setMaxDiscount(e.target.value)} 
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Ngày bắt đầu:</label>
                        <input 
                            type="date" 
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Ngày kết thúc:</label>
                        <input 
                            type="date" 
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>

                    {/* Trường số lượng đã được ẩn đi vì số lượng voucher riêng tư luôn là 1 */}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleCreatePrivateVoucher}
                    >
                        Tạo Voucher
                    </button>
                    <button 
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateVoucherModal;
