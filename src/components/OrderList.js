import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllOrder, filterOrdersByCity, updateOrderStatusApi } from '../services/orderService';
import { getAllUsers } from '../services/userServices';
import { statusMap, statusColors } from '../utils/StatusColors';

// Mảng này định nghĩa các nút bấm lọc trên giao diện
const statuses = [
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đang giao',
  'Giao thành công',
  'Đã nhận',
  'Hoàn hàng',
  'Đã hủy',
];

const CategoryDetailProduct = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [cityFilter, setCityFilter] = useState('Tổng kho');
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mảng trạng thái động dựa trên cityFilter
  const getStatuses = () => {
    if (cityFilter === 'Hà Nội') {
      return [
        'Đơn hàng tới bưu cục',
        'Đang giao',
        'Giao thành công',
        'Đã nhận',
        'Hoàn hàng',
        'Đã hủy',
      ];
    } else {
      return [
        'Chờ xác nhận',
        'Đã xác nhận',
        'Đang giao',
        'Giao thành công',
        'Đã nhận',
        'Hoàn hàng',
        'Đã hủy',
      ];
    }
  };

  // useEffect để fetch dữ liệu khi component được tải
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, userData] = await Promise.all([
          getAllOrder(),
          getAllUsers()
        ]);
        setOrders(orderData);
        setUsers(userData);
      } catch (error)      {
          console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, [location]); // Fetch lại khi URL thay đổi

  // Hàm xử lý thay đổi city filter
  const handleCityChange = async (city) => {
    setCityFilter(city);
    setIsLoadingCity(true);
    
    try {
      if (city === 'Tổng kho') {
        // Lấy tất cả đơn hàng
        const orderData = await getAllOrder();
        setOrders(orderData);
      } else {
        // Lọc đơn hàng theo thành phố
        const filteredOrders = await filterOrdersByCity(city);
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error('Lỗi khi lọc đơn hàng theo thành phố:', error);
      alert('Có lỗi xảy ra khi lọc đơn hàng!');
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Hàm xử lý xác nhận đơn hàng
  const handleConfirmOrder = async (orderId) => {
    const idAdmin = localStorage.getItem('adminId');
    if (!idAdmin) {
      alert('Không tìm thấy thông tin admin!');
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatusApi(orderId, 2, idAdmin);
      
      // Cập nhật trạng thái đơn hàng trong state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 2 }
            : order
        )
      );
      
      alert('✅ Xác nhận đơn hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi xác nhận đơn hàng:', error);
      alert('❌ Có lỗi xảy ra khi xác nhận đơn hàng!');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Hàm xử lý xuất kho
  const handleExportWarehouse = async (orderId) => {
    const idAdmin = localStorage.getItem('adminId');
    if (!idAdmin) {
      alert('Không tìm thấy thông tin admin!');
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatusApi(orderId, 3, idAdmin);
      
      // Cập nhật trạng thái đơn hàng trong state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 3 }
            : order
        )
      );
      
      alert('✅ Xuất kho thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất kho:', error);
      alert('❌ Có lỗi xảy ra khi xuất kho!');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Hàm xử lý nhận hàng tại bưu cục
  const handleReceiveAtPostOffice = async (orderId) => {
    const idAdmin = localStorage.getItem('adminId');
    if (!idAdmin) {
      alert('Không tìm thấy thông tin admin!');
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatusApi(orderId, 4, idAdmin);
      
      // Cập nhật trạng thái đơn hàng trong state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 4 }
            : order
        )
      );
      
      alert('✅ Nhận hàng tại bưu cục thành công!');
    } catch (error) {
      console.error('Lỗi khi nhận hàng tại bưu cục:', error);
      alert('❌ Có lỗi xảy ra khi nhận hàng tại bưu cục!');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Logic lọc danh sách đơn hàng
  const filteredOrders = orders
    .filter(order => {
      // 1. Lọc theo mã đơn hàng
      const searchMatch = (`SMT${order._id}`).toLowerCase().includes(search.toLowerCase());

      // 2. Lọc theo trạng thái
      if (!statusFilter) {
        return searchMatch; // Nếu không có bộ lọc trạng thái, chỉ cần khớp tìm kiếm
      }

      // Chuyển status sang SỐ để so sánh một cách an toàn và đáng tin cậy
      const statusNumber = Number(order.status);

      if (statusFilter === 'Hoàn hàng') {
        // Lọc tất cả các trạng thái trong quy trình hoàn hàng (13 đến 18)
        return searchMatch && statusNumber > 12 && statusNumber < 19;
      } else if (statusFilter === 'Đơn hàng tới bưu cục') {
        // Lọc đơn hàng có trạng thái 3 (Rời kho)
        return searchMatch && statusNumber === 3;
      } else {
        // Logic lọc thông thường cho các trạng thái khác
        return searchMatch && statusMap[statusNumber] === statusFilter;
      }
    })
    .reverse(); // Đảo ngược để đơn hàng mới nhất lên đầu

  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.fullname || user?.username || user?.email || 'Không rõ';
  };
  
  // const handleRowClick = (order) => {
  //   const statusNumber = Number(order.status);
  //   if (statusNumber > 12 && statusNumber < 19) {
  //     // Điều hướng đến trang chi tiết đơn hàng hoàn
  //     navigate(`/return-orders/SMT${order._id}`);
  //   } else {
  //     // Điều hướng đến trang chi tiết đơn hàng thông thường
  //     navigate(`/orders/SMT${order._id}`);
  //   }
  // };

  const handleRowClick = (order) => {
  const statusNumber = Number(order.status);
  if (statusNumber >= 13 && statusNumber <= 18) {
    navigate(`/return-details/SMT${order._id}`);
  } else {
    navigate(`/orders/SMT${order._id}`);
  }
};

  return (
  <div className="p-6">
    {/* Header + Nút quản lý hàng hoàn */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">Đơn hàng</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Spinner lọc theo thành phố */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Khu vực:</span>
          <select
            value={cityFilter}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={isLoadingCity}
            className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          >
            <option value="Tổng kho">Tổng kho</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
          {isLoadingCity && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        
        <button
          onClick={() => navigate('/return-requests')}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap"
        >
          Lịch sử hàng hoàn
        </button>
      </div>
    </div>

    {/* Thanh lọc trạng thái + tìm kiếm */}
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      {/* Nhóm nút trạng thái */}
      <div className="flex gap-2 flex-wrap">
        {getStatuses().map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo mã đơn"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2"
      />
    </div>

    {/* Bảng danh sách đơn hàng */}
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Mã đơn hàng</th>
            <th className="p-3">Tên người đặt</th>
            <th className="p-3">Người nhận</th>
            <th className="p-3">Ngày đặt hàng</th>
            <th className="p-3 min-w-[180px]">Trạng thái</th>
            <th className="p-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order._id}
              className="bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
            >
              <td 
                className="p-3 font-medium"
                onClick={() => handleRowClick(order)}
              >
                SMT{order._id}
              </td>
              <td 
                className="p-3"
                onClick={() => handleRowClick(order)}
              >
                {getUserNameById(order.userId)}
              </td>
              <td 
                className="p-3"
                onClick={() => handleRowClick(order)}
              >
                {order.id_address?.fullName || '...'}
              </td>
              <td 
                className="p-3"
                onClick={() => handleRowClick(order)}
              >
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td 
                className="p-3 min-w-[180px]"
                onClick={() => handleRowClick(order)}
              >
                <span
                  className={`px-4 py-1 rounded-full font-semibold text-sm inline-block min-w-[140px] text-center whitespace-nowrap ${
                    statusColors[statusMap[order.status]] || 'bg-gray-200'
                  }`}
                >
                  {statusMap[order.status] || 'Không rõ'}
                </span>
              </td>
              <td className="p-3">
                {order.status === 1 && cityFilter !== 'Hà Nội' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmOrder(order._id);
                    }}
                    disabled={updatingOrderId === order._id}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updatingOrderId === order._id ? 'Đang xử lý...' : 'Xác nhận'}
                  </button>
                )}
                {order.status === 2 && cityFilter !== 'Hà Nội' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportWarehouse(order._id);
                    }}
                    disabled={updatingOrderId === order._id}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updatingOrderId === order._id ? 'Đang xử lý...' : 'Xuất kho'}
                  </button>
                )}
                {order.status === 3 && cityFilter === 'Hà Nội' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReceiveAtPostOffice(order._id);
                    }}
                    disabled={updatingOrderId === order._id}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updatingOrderId === order._id ? 'Đang xử lý...' : 'Nhận hàng tại bưu cục'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default CategoryDetailProduct;