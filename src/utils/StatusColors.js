// Ánh xạ số trạng thái -> tên trạng thái
const statusMap = {
  1: 'Chờ xác nhận',
  2: 'Đã xác nhận',
  6: 'Đang giao',
  7: 'Giao thành công',
  8: 'Đã nhận',
  13: 'Hoàn hàng',
  19: 'Hủy',
};

// Màu trạng thái
const statusColors = {
  'Chờ xác nhận': 'bg-gray-200 text-gray-800',
  'Đã xác nhận': 'bg-blue-200 text-blue-900',
  'Đang giao': 'bg-yellow-300 text-yellow-900',
  'Giao thành công': 'bg-green-200 text-green-800',
  'Đã nhận': 'bg-green-100 text-green-700',
  'Hoàn hàng': 'bg-orange-200 text-orange-800',
  "Hủy đơn": 'bg-red-100 text-red-700',
  "Hủy": 'bg-red-100 text-red-700',
  "hủy": 'bg-red-100 text-red-700',
  "hủy đơn": 'bg-red-100 text-red-700',
  "Đã hủy": 'bg-red-100 text-red-700',
  "Đã Hủy": 'bg-red-100 text-red-700',
};

export { statusMap, statusColors };
