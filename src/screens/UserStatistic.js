import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopSpenders, getTopBuyersByQuantity } from "../services/statisticUserService";

const UserStatistics = () => {
  const [stats, setStats] = useState([]);
  const [sortBy, setSortBy] = useState("totalSpent");
  const [limit, setLimit] = useState(0); // 0 = tất cả
  const [limitInput, setLimitInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [spenders, buyers] = await Promise.all([
          getTopSpenders(99999),
          getTopBuyersByQuantity(99999)
        ]);

        const merged = spenders.map(s => {
          const buyer = buyers.find(b => b.userId === s.userId) || {};
          return {
            userId: s.userId,
            fullname: s.fullname,
            totalSpent: s.totalSpent || 0,
            totalQuantityPurchased: buyer.totalQuantityPurchased || 0,
            orderCount: s.orderCount || 0
          };
        });

        setStats(merged);
      } catch (err) {
        console.error("Lỗi khi lấy thống kê:", err);
      }
    };

    fetchStats();
  }, []);

  const filteredStats = stats
    .sort((a, b) => {
      if (sortBy === "totalSpent") {
        return b.totalSpent - a.totalSpent;
      } else if (sortBy === "totalProducts") {
        return b.totalQuantityPurchased - a.totalQuantityPurchased;
      }
      return 0;
    })
    .slice(0, limit > 0 ? limit : stats.length);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">📊 Thống kê mua hàng</h1>

      <div className="flex justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("totalSpent")}
            className={`px-4 py-2 rounded ${sortBy === "totalSpent" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            💰 Tổng chi tiêu
          </button>
          <button
            onClick={() => setSortBy("totalProducts")}
            className={`px-4 py-2 rounded ${sortBy === "totalProducts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            📦 Tổng sản phẩm
          </button>
        </div>

       <div>
  <label className="mr-2">Giới hạn: </label>
  <input
    type="number"
    min="0"
    placeholder="Nhập ..."
    value={limitInput}
    onChange={(e) => setLimitInput(e.target.value)}
    className="border rounded px-3 py-2 w-24"
  />
  <button
    onClick={() => setLimit(Number(limitInput))}
    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded"
  >
    Áp dụng
  </button>
</div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
  <tr className="bg-gray-100 text-left">
    <th className="p-3 border">Tên người dùng</th>
    {sortBy === "totalSpent" ? (
      <>
        <th className="p-3 border text-center">Tổng đơn hàng</th>
        <th className="p-3 border text-center">Tổng tiền chi</th>
      </>
    ) : (
      <>
        <th className="p-3 border text-center">Tổng đơn hàng</th>
        <th className="p-3 border text-center">Tổng sản phẩm</th>
      </>
    )}
  </tr>
</thead>

<tbody>
  {filteredStats.map(user => (
    <tr key={user.userId} className="border-b">
      <td
        className="p-3 border cursor-pointer text-blue-600 hover:underline"
        onClick={() => navigate(`/users/${user.userId}/orders`)}
      >
        {user.fullname}
      </td>

      {sortBy === "totalSpent" ? (
        <>
          <td className="p-3 border text-center">{user.orderCount}</td>
          <td className="p-3 border text-center bg-yellow-100 font-semibold">
            {user.totalSpent?.toLocaleString("vi-VN")} đ
          </td>
        </>
      ) : (
        <>
          <td className="p-3 border text-center">{user.orderCount}</td>
          <td className="p-3 border text-center bg-yellow-100 font-semibold">
            {user.totalQuantityPurchased}
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default UserStatistics;
