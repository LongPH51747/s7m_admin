import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopSpenders, getTopBuyersByQuantity } from "../services/statisticUserService";

const UserStatistics = () => {
  const [stats, setStats] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
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
            totalProducts: buyer.totalQuantityPurchased || 0
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
    .filter(user => user.fullname?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "totalSpent") {
        return b.totalSpent - a.totalSpent;
      } else if (sortBy === "totalProducts") {
        return b.totalProducts - a.totalProducts;
      }
      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">📊 Thống kê mua hàng</h1>

      <div className="flex justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("totalSpent")}
            className={`px-4 py-2 rounded ${sortBy === "totalSpent" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            💰 Tổng tiền nhiều nhất
          </button>
          <button
            onClick={() => setSortBy("totalProducts")}
            className={`px-4 py-2 rounded ${sortBy === "totalProducts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            📦 Số lượng nhiều nhất
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo họ tên"
            className="border rounded px-3 py-2 pr-10"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Tên người dùng</th>
            <th className="p-3 border text-center">Tổng sản phẩm</th>
            <th className="p-3 border text-center">Tổng tiền chi</th>
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
              <td
                className={`p-3 border text-center ${
                  sortBy === "totalProducts" ? "bg-yellow-100 font-semibold" : ""
                }`}
              >
                {user.totalProducts}
              </td>
              <td
                className={`p-3 border text-center ${
                  sortBy === "totalSpent" ? "bg-yellow-100 font-semibold" : ""
                }`}
              >
                {user.totalSpent?.toLocaleString("vi-VN")} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserStatistics;
