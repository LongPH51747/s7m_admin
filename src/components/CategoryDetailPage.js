import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const CategoryDetailPage = ({ categorySlug }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/${categorySlug}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await axios.delete(`${API_URL}/${categorySlug}/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Các sản phẩm của danh mục: {categorySlug}
      </h2>

      <div className="grid grid-cols-5 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-3 shadow relative hover:shadow-md transition"
          >
            <img
              src={process.env.PUBLIC_URL + p.img} 
              alt={p.name}
              className="w-full h-48 object-cover rounded"
            />

            <div className="absolute top-2 right-2 flex gap-2">
              <FiEdit2
                className="text-gray-700 hover:text-blue-500 cursor-pointer"
                onClick={() =>
                  navigate(`/category/${categorySlug}/edit/${p.id}`)
                }
              />
              <FiTrash
                className="text-gray-700 hover:text-red-500 cursor-pointer"
                onClick={() => handleDelete(p.id)}
              />
            </div>

            <p className="mt-3 font-semibold">{p.price.toFixed(2)}$</p>
            <p className="text-sm text-gray-700">{p.name}</p>
          </div>
        ))}

        {/* Ô thêm mới */}
        <div
          onClick={() => navigate(`/category/${categorySlug}/add`)}
          className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-5xl text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition"
        >
          +
        </div>
      </div>

      {products.length === 0 && (
        <p className="col-span-5 text-gray-500 mt-4">
          Không có sản phẩm nào trong danh mục này.
        </p>
      )}
    </div>
  );
};

export default CategoryDetailPage;
