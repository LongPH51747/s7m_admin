import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../services/productsService";
import { getAllCategories } from "../services/categoryService";
import { API_BASE } from "../services/LinkApi"; // Import đường dẫn gốc của API

// Hàm chuẩn hóa slug
const normalize = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .trim();

const CategoryDetailPage = () => {
  const { categorySlug } = useParams();

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
          (c) => normalize(c.category_name) === normalize(categorySlug)
        );

        if (!category || !category._id) {
          throw new Error("❌ Không tìm thấy danh mục hoặc thiếu _id.");
        }

        setCategoryName(category.category_name);

        const productList = await getProductsByCategoryId(category._id);
        if (!Array.isArray(productList)) {
          throw new Error("❌ Dữ liệu sản phẩm không hợp lệ.");
        }

        setProducts(productList);
      } catch (err) {
        console.error("💥 Lỗi xảy ra:", err);
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
        ❌❌❌ {error}
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
            <div key={p._id} className="border p-2 rounded shadow text-center">
              <img
                src={
                  p.product_image
                    ? `${API_BASE}${p.product_image}`
                    : "/images/default.jpg"
                }
                alt={p.product_name || "Sản phẩm"}
                className="w-full h-40 object-cover mb-2 rounded bg-gray-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default.jpg";
                }}
              />
              <h3 className="font-medium">{p.product_name || "Tên sản phẩm"}</h3>
            <p className="text-gray-500">
  {p.product_price
    ? `${Number(p.product_price).toLocaleString()} đ`
    : p.product_variant?.[0]?.variant_price
      ? `${Number(p.product_variant[0].variant_price).toLocaleString()} đ`
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
