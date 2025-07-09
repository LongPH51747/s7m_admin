import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productsService"; // đường dẫn đúng file của bạn
import { useParams } from "react-router-dom";

const CategoryDetailPage = () => {
  const [products, setProducts] = useState([]);
  const { categorySlug } = useParams(); // nếu dùng param trong URL

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    const allProducts = await getAllProducts();
    if (allProducts) {
      const filtered = allProducts.filter(
        (p) => p.product_category === categorySlug
      );
      setProducts(filtered);
    }
  };

  return (
    <div>
      <h2>Các sản phẩm của danh mục: {categorySlug}</h2>
      {products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>{p.name} - {p.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDetailPage;
