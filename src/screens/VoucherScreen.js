import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import { ENDPOINTS } from '../config/api';

const VoucherDisplayScreen = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // State to store the voucher being edited
    const [editingVoucher, setEditingVoucher] = useState(null);

    const [newVoucher, setNewVoucher] = useState({
        code: '',
        type: 'percentage',
        value: 0,
        maxDiscount: 0,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
        isPublic: true,
        limit: 0,
        userId: null,
    });

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(ENDPOINTS.GET_ALL_VOUCHERS, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.status !== 200) {
                throw new Error('Could not fetch data from the API.');
            }

            const data = response.data;

            const formattedVouchers = data.map(voucher => {
                const formatDateString = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        return 'N/A';
                    }
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${day}-${month}-${year}`;
                };

                return {
                    ...voucher,
                    startDate: formatDateString(voucher.startDate),
                    endDate: formatDateString(voucher.endDate),
                };
            });

            setVouchers(formattedVouchers);
        } catch (err) {
            console.error("Error fetching voucher data:", err);
            setError(`Could not load voucher data. Please check your connection or API URL. Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const openModal = (voucher = null) => {
        setIsModalOpen(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        if (voucher) {
            setEditingVoucher(voucher);
            // Format the date to be correctly displayed in the input type="date" (yyyy-mm-dd)
            const formattedStartDate = voucher.startDate.split('-').reverse().join('-');
            const formattedEndDate = voucher.endDate.split('-').reverse().join('-');
            setNewVoucher({
                ...voucher,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });
        } else {
            setEditingVoucher(null);
            setNewVoucher({
                code: '',
                type: 'percentage',
                value: 0,
                maxDiscount: 0,
                minOrderValue: 0,
                startDate: '',
                limit: 0,
                userId: null,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVoucher(null); // Reset editing state
        setNewVoucher({ // Reset form when closing modal
            code: '',
            type: 'percentage',
            value: 0,
            maxDiscount: 0,
            minOrderValue: 0,
            startDate: '',
            endDate: '',
            isPublic: true,
            limit: 0,
            userId: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewVoucher(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        const voucherData = { ...newVoucher };
        if (voucherData.type === 'fixed') {
            delete voucherData.maxDiscount;
        }

        voucherData.limit = Number(voucherData.limit);
        voucherData.userId = null;
        voucherData.isPublic = true;

        try {
            let response;
            if (editingVoucher) {
                // Update voucher (PUT)
                response = await axios.put(
                    ENDPOINTS.UPDATE_VOUCHER(editingVoucher._id), 
                    voucherData,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Add new voucher (POST)
                response = await axios.post(ENDPOINTS.CREATE_VOUCHER, voucherData, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json',
                    },
                });
            }

            if (response.status >= 200 && response.status < 300) {
                setSubmitSuccess(true);
                fetchVouchers();
                setTimeout(() => {
                    closeModal();
                    setSubmitSuccess(false);
                }, 2000);
            } else {
                throw new Error(response.data?.message || 'An error occurred while processing the voucher.');
            }
        } catch (err) {
            console.error("Error processing voucher:", err.response?.data || err.message);
            setSubmitError(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

   


    return (
        <div className="home-page bg-gray-100 min-h-screen">
            <TopBar />
            <div className="flex main-content">
                <Sidebar />

                <div className="p-6 flex-1">
                    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Voucher</h1>
                            <button
                                onClick={() => openModal()}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                            >
                                Thêm voucher
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                                <div className="ml-4 text-xl font-medium text-gray-700">Đang tải dữ liệu...</div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center p-6 rounded-lg bg-white shadow-lg">
                                    <p className="text-red-500 font-bold mb-4">{error}</p>
                                    <button
                                        onClick={fetchVouchers}
                                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                                    >
                                        Tải lại
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Voucher</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Trị</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn Hàng Tối Thiểu</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm Tối Đa</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL Sử Dụng</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Bắt Đầu</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Kết Thúc</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công Khai</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {vouchers.map((voucher) => (
                                            <tr key={voucher._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voucher.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.type === 'percentage' ? 'Phần trăm' : 'Số tiền'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.type === 'percentage' ? `${voucher.value}%` : `${new Intl.NumberFormat('vi-VN').format(voucher.value)}đ`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)}đ</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Intl.NumberFormat('vi-VN').format(voucher.maxDiscount)}đ</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.limit}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.startDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.endDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {voucher.isPublic ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Có</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Không</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openModal(voucher)}
                                                        className="px-3 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors duration-300"
                                                    >
                                                        Sửa
                                                    </button>
                                                   
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && !error && vouchers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>Chưa có voucher nào được thêm.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal thêm/cập nhật voucher */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-8 bg-white w-full max-w-lg rounded-lg shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">
                            {editingVoucher ? 'Cập nhật Voucher' : 'Thêm Voucher Mới'}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                                {/* Mã Voucher */}
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={newVoucher.code}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                {/* Loại */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={newVoucher.type}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    >
                                        <option value="percentage">Phần trăm (%)</option>
                                        <option value="fixed">Số tiền cố định (đ)</option>
                                    </select>
                                </div>
                                {/* Giá Trị */}
                                <div>
                                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">Giá Trị</label>
                                    <input
                                        type="number"
                                        name="value"
                                        id="value"
                                        value={newVoucher.value}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                {/* Giảm giá tối đa */}
                                {newVoucher.type === 'percentage' && (
                                    <div>
                                        <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">Giảm giá tối đa</label>
                                        <input
                                            type="number"
                                            name="maxDiscount"
                                            id="maxDiscount"
                                            value={newVoucher.maxDiscount}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                )}
                                {/* Đơn Hàng Tối Thiểu */}
                                <div>
                                    <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700">Đơn Hàng Tối Thiểu</label>
                                    <input
                                        type="number"
                                        name="minOrderValue"
                                        id="minOrderValue"
                                        value={newVoucher.minOrderValue}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                {/* Số lượng sử dụng */}
                                <div>
                                    <label htmlFor="limit" className="block text-sm font-medium text-gray-700">Số lượng sử dụng</label>
                                    <input
                                        type="number"
                                        name="limit"
                                        id="limit"
                                        value={newVoucher.limit}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                {/* Ngày Bắt Đầu */}
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Ngày Bắt Đầu</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        id="startDate"
                                        value={newVoucher.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                {/* Ngày Kết Thúc */}
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Ngày Kết Thúc</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        id="endDate"
                                        value={newVoucher.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            {submitError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                                    <p>{submitError}</p>
                                </div>
                            )}

                            {submitSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert">
                                    <p>{editingVoucher ? 'Cập nhật voucher thành công!' : 'Thêm voucher thành công!'}</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                                >
                                    {submitting ? (editingVoucher ? 'Đang cập nhật...' : 'Đang lưu...') : (editingVoucher ? 'Cập nhật' : 'Lưu')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
            
        </div>
    );
};

export default VoucherDisplayScreen;
