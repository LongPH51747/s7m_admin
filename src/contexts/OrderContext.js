import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

const initialOrders = [
  {
    code: 'MDI9303',
    customer: { name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0123456789', address: 'Hà Nội' },
    date: '2025-05-02',
    status: 'Thành công',
    orderDate: '2025-05-01',
    shipping: 'Giao hàng tiêu chuẩn',
    paymentMethod: 'Momo',
    items: [
      { name: 'Áo sơ mi', quantity: 2, price: 250000 },
      { name: 'Giày da', quantity: 1, price: 500000 },
    ],
    voucher: 50000,
  },
  {
    code: 'BH62744',
    customer: { name: 'Trần Trương B', email: 'b@gmail.com', phone: '0988777666', address: 'Hà Đông' },
    date: '2025-03-15',
    status: 'Đang giao',
    orderDate: '2025-03-15',
    shipping: 'Giao hàng nhanh',
    paymentMethod: 'COD',
    items: [
      { name: 'Váy hai dây', quantity: 1, price: 200000 },
      { name: 'Quần bò', quantity: 1, price: 150000 },
    ],
    voucher: 30000,
  },
  {
    code: 'KH81736',
    customer: { name: 'Phan Mạnh Q', email: 'q@gmail.com', phone: '0932111222', address: 'Hải Phòng' },
    date: '2025-02-28',
    status: 'Chờ xác nhận',
    orderDate: '2025-02-27',
    shipping: 'Giao hàng tiết kiệm',
    paymentMethod: 'ZaloPay',
    items: [
      { name: 'Quần short', quantity: 2, price: 180000 },
    ],
    voucher: 20000,
  },
  {
    code: 'PJ71728',
    customer: { name: 'Nguyễn Tuấn H', email: 'h@gmail.com', phone: '0977665544', address: 'Đà Nẵng' },
    date: '2025-01-14',
    status: 'Thành công',
    orderDate: '2025-01-13',
    shipping: 'Giao hàng nhanh',
    paymentMethod: 'Momo',
    items: [
      { name: 'Áo hoodie', quantity: 1, price: 400000 },
    ],
    voucher: 0,
  },
  {
    code: 'UH62735',
    customer: { name: 'Đàm Vĩnh L', email: 'l@gmail.com', phone: '0911223344', address: 'Huế' },
    date: '2024-07-22',
    status: 'Đang giao',
    orderDate: '2024-07-21',
    shipping: 'Giao hàng tiêu chuẩn',
    paymentMethod: 'COD',
    items: [
      { name: 'Áo khoác gió', quantity: 1, price: 350000 },
      { name: 'Giày sneaker', quantity: 1, price: 600000 },
    ],
    voucher: 100000,
  },
  {
    code: 'AH27362',
    customer: { name: 'Thích Là Nhích', email: 'nhich@gmail.com', phone: '0909000900', address: 'Nha Trang' },
    date: '2023-05-26',
    status: 'Hoàn hàng',
    orderDate: '2023-05-25',
    shipping: 'Giao hàng tiết kiệm',
    paymentMethod: 'COD',
    items: [
      { name: 'Áo len cổ lọ', quantity: 1, price: 320000 },
    ],
    voucher: 0,
  },
  {
    code: 'XH10234',
    customer: { name: 'Phạm Nhật M', email: 'm@gmail.com', phone: '0901234567', address: 'Bắc Giang' },
    date: '2025-06-01',
    status: 'Chờ xác nhận',
    orderDate: '2025-05-31',
    shipping: 'Giao hàng nhanh',
    paymentMethod: 'COD',
    items: [
      { name: 'Balo laptop', quantity: 1, price: 450000 },
    ],
    voucher: 50000,
  },
  {
    code: 'ZT98210',
    customer: { name: 'Hoàng Thị C', email: 'c@gmail.com', phone: '0911002200', address: 'TP. Hồ Chí Minh' },
    date: '2025-04-18',
    status: 'Thành công',
    orderDate: '2025-04-17',
    shipping: 'Giao hàng tiêu chuẩn',
    paymentMethod: 'Chuyển khoản ngân hàng',
    items: [
      { name: 'Đồng hồ đeo tay', quantity: 1, price: 1500000 },
    ],
    voucher: 150000,
  },
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(initialOrders);

  const updateOrderStatus = (code, newStatus) => {
    setOrders(prev =>
      prev.map(order => order.code === code ? { ...order, status: newStatus } : order)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
