import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../services/productsService";
import { getAllCategories } from "../services/categoryService";

const CategoryDetailPage = () => {
  const { categorySlug } = useParams(); // 👈 Đúng tên param ở route

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!categorySlug) {
          throw new Error("❌ Thiếu slug danh mục trên URL.");
        }

        const categories = await getAllCategories();

        if (!Array.isArray(categories) || categories.length === 0) {
          throw new Error("❌ Không có danh mục nào.");
        }

        const category = categories.find(
          (c) =>
            typeof c.slug === "string" &&
            c.slug.toLowerCase() === categorySlug.toLowerCase()
        );

        if (!category || !category._id) {
          throw new Error("❌ Không tìm thấy danh mục hoặc thiếu _id.");
        }

        setCategoryName(category.name);

        const productList = await getProductsByCategoryId(category._id);

        if (!Array.isArray(productList)) {
          throw new Error("❌ Dữ liệu sản phẩm không hợp lệ.");
        }

        setProducts(productList);
      } catch (err) {
        console.error(err);
        setError(err.message || "❌ Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  if (loading) return <p>🔄 Đang tải dữ liệu...</p>;

  if (error) {
    return (
      <p className="text-red-500 flex items-center gap-2">
        ❌ {error}
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        📂 Sản phẩm thuộc danh mục: {categoryName}
      </h2>

      {products.length === 0 ? (
        <p>🚫 Không có sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="border p-2 rounded shadow text-center"
            >
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name || "Sản phẩm"}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="font-medium">{p.name || "Tên sản phẩm"}</h3>
              <p className="text-gray-500">
                {p.price
                  ? `${Number(p.price).toLocaleString()} đ`
                  : "Chưa có giá"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;
