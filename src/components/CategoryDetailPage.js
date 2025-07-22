import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../services/productsService";
import { getAllCategories } from "../services/categoryService";

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
        console.log("👉 categorySlug trên URL:", categorySlug);

        setLoading(true);
        setError("");

        if (!categorySlug) {
          throw new Error("❌ Thiếu slug danh mục trên URL.");
        }

        const categories = await getAllCategories();
        console.log("📦 Danh sách categories lấy từ API:", categories);

        if (!Array.isArray(categories) || categories.length === 0) {
          throw new Error("❌ Không có danh mục nào.");
        }

        categories.forEach((c) => {
          console.log(
            `📝 category: category_name=${c.category_name}, normalize(category_name)=${normalize(
              c.category_name
            )}`
          );
        });

        const category = categories.find(
          (c) => normalize(c.category_name) === normalize(categorySlug)
        );

        console.log("🔍 Kết quả tìm category:", category);

        if (!category || !category._id) {
          throw new Error("❌ Không tìm thấy danh mục hoặc thiếu _id.");
        }

        setCategoryName(category.category_name);

        const productList = await getProductsByCategoryId(category._id);
        console.log("📦 Danh sách sản phẩm:", productList);

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
            <div
  key={p._id}
  className="border p-2 rounded shadow text-center"
>
  <img
    src={p.product_image || "https://via.placeholder.com/150"}
    alt={p.product_name || "Sản phẩm"}
    className="w-full h-40 object-cover mb-2"
  />
  <h3 className="font-medium">{p.product_name || "Tên sản phẩm"}</h3>
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
