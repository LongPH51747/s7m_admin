// Ánh xạ số trạng thái -> tên trạng thái
const statusMap = {
  1: 'Chờ xác nhận',
  2: 'Đã xác nhận',
  3: 'Rời kho',
  4: 'Tới bưu cục',
  5: 'Shipper nhận hàng',
  6: 'Đang giao',
  7: 'Giao thành công',
  8: 'Đã nhận',
  9: 'Giao thất bại',
  10: 'Bưu cục nhận hàng bom',
  11: 'Đơn bom rời bưu cục về kho',
  12: 'Đơn bom tới kho',
  13: 'Chờ xác nhận hoàn hàng',
  14: 'Đã xác nhận hoàn',
  15: 'Shipper đã nhận hàng hoàn',
  16: 'Bưu cục nhận hàng hoàn',
  17: 'Hàng hoàn rời bưu cục',
  18: 'Hàng hoàn tới kho',
  19: 'Đã hủy',
  24: 'Không xác nhận đơn hoàn'
};

const statusColors = {
  'Chờ xác nhận': 'bg-gray-200 text-gray-800',
  'Đã xác nhận': 'bg-blue-200 text-blue-900',
  'Rời kho': 'bg-purple-200 text-purple-900',
  'Tới bưu cục': 'bg-indigo-200 text-indigo-900',
  'Shipper nhận hàng': 'bg-yellow-200 text-yellow-900',
  'Đang giao': 'bg-yellow-300 text-yellow-900',
  'Giao thành công': 'bg-green-300 text-green-900',
  'Đã nhận': 'bg-green-200 text-green-800',
  'Chờ xác nhận hoàn hàng': 'bg-orange-200 text-orange-800', 
  'Đã xác nhận hoàn': 'bg-orange-300 text-orange-900', 
  'Shipper đã nhận hàng hoàn': 'bg-amber-300 text-amber-900', 
  'Bưu cục nhận hàng hoàn': 'bg-amber-200 text-amber-800', 
  'Hàng hoàn rời bưu cục': 'bg-amber-200 text-amber-800', 
  'Hàng hoàn tới kho': 'bg-slate-300 text-slate-800', 
  'Đã hủy': 'bg-red-200 text-red-900', 
};


const statusMapUpdates = {
  1: 'Chờ xác nhận',
  2: 'Xác nhận',
  6: 'Đang giao',
  7: 'Giao thành công',
  14: 'Xác nhận hoàn',
  19: 'Đã hủy'
};


export { statusMap, statusColors, statusMapUpdates };


