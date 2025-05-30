import React from 'react';
import { useParams } from 'react-router-dom';

const mockOrder = {
  code: 'BH62744',
  orderDate: '2025-03-15',
  shipping: 'Giao hàng nhanh',
  paymentMethod: 'Thanh toán khi nhận hàng',
  customer: {
    name: 'Nguyễn Văn B',
    email: 'nguyenvanb2005@gmail.com',
    phone: '0934567332',
    address: 'số 778 mùa Xuân, Yên Nghĩa, Hà Đông, Hà Nội',
  },
  status: 'Đang giao',
  items: [
    { name: 'Váy hai dây', quantity: 1, price: 200000 },
    { name: 'Quần bò', quantity: 1, price: 150000 },
  ],
  voucher: 30000,
};

const OrderDetailPage = () => {
  const { orderCode } = useParams();
  const order = mockOrder; // sau này bạn có thể fetch theo orderCode

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = total - order.voucher;

  return (
    <div className="max-w-5xl mx-auto p-6 border-2 border-blue-500 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ĐƠN HÀNG #{order.code}</h1>
        <span className="px-4 py-1 rounded-full bg-green-200 text-green-800 font-semibold">
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Thông Tin Đặt Hàng</h2>
            <p>Ngày đặt hàng: <strong>{order.orderDate}</strong></p>
            <p>Hình thức vận chuyển: <strong>{order.shipping}</strong></p>
            <p>Hình thức thanh toán: <strong>{order.paymentMethod}</strong></p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Thông Tin Khách Hàng</h2>
            <p>Tên khách hàng: <strong>{order.customer.name}</strong></p>
            <p>Email: {order.customer.email}</p>
            <p>Số điện thoại: {order.customer.phone}</p>
            <p>Địa chỉ: {order.customer.address}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Trạng Thái Đơn Hàng</h2>
            <select className="w-full border px-3 py-2 rounded mb-2">
              <option>Đang giao</option>
              <option>Thành công</option>
              <option>Chờ xác nhận</option>
              <option>Hoàn hàng</option>
            </select>
            <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Cập nhật
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Đơn Hàng</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Sản phẩm</th>
                  <th className="text-center py-1">Số lượng</th>
                  <th className="text-right py-1">Giá tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-1">{item.name}</td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-right py-1">
                      {item.price.toLocaleString()}₫
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-right font-semibold pt-2">Tổng tiền:</td>
                  <td className="text-right pt-2">{total.toLocaleString()}₫</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-right">Voucher:</td>
                  <td className="text-right text-red-500">-{order.voucher.toLocaleString()}₫</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-right font-bold pt-2">Thanh toán:</td>
                  <td className="text-right font-bold text-green-600">
                    {finalTotal.toLocaleString()}₫
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
