import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getAllCategories,
  addCategory,
  deleteCategory
} from '../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false); // ✅ Trạng thái xem thêm
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        console.log("dataCate", data);
        
        // setCategories(data);
         setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const name = prompt('Nhập tên danh mục mới:');
      if (!name) return;

      const isDuplicate = categories.some(
        cat => cat.category_name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (isDuplicate) {
        alert('Tên danh mục đã tồn tại!');
        return;
      }

      const newCategory = {
        category_name: name.trim(),
        category_image: e.target.result,
      };

      try {
        const added = await addCategory(newCategory);
        setCategories(prev => [...prev, added]);
      } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveCategory = async (id, e) => {
  e.stopPropagation();
  const confirm = window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?');
  if (!confirm) return;

  try {
    await deleteCategory(id);

    // ✅ Xóa thành công
    setCategories(prev => prev.filter(cat => cat._id !== id));
    alert('✅ Xóa danh mục thành công!');
  } catch (error) {
    console.error('Danh mục có sản phẩm, không xóa được!', error);

    // ✅ Kiểm tra message từ backend (ví dụ: "Không thể xóa vì danh mục có sản phẩm")
    if (error.response && error.response.data && error.response.data.message) {
      alert(`⚠️ ${error.response.data.message}`);
    } else {
      alert('Danh mục có sản phẩm, không xóa được!');
    }
  }
};


  const handleClick = (slugSource) => {
    const slug = slugSource.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${slug}`);
  };
  console.log("categori",categories);
  
  const visibleCategories = showAll ? categories : categories.slice(0, 4); // ✅ Hiển thị 4 danh mục ban đầu

  return (
  <div className="mt-8">
    {/* Tiêu đề và nút cùng dòng */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Danh mục sản phẩm</h2>

      {categories.length > 4 && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-1 text-sm font-medium text-white rounded-full shadow transition
            ${showAll ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {showAll ? (
            <>
              <ChevronUp size={16} /> Thu gọn
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Xem thêm
            </>
          )}
        </button>
      )}
    </div>

    {/* Danh sách danh mục */}
    <div className="grid grid-cols-4 gap-4">
      {visibleCategories.map(cat => (
        <div
          key={cat._id}
          className="border rounded-lg p-2 relative cursor-pointer"
          onClick={() => handleClick(cat.category_name)}
        >
          <img
            src={cat.category_image}
            alt={cat.category_name}
            className="rounded w-full h-48 object-contain bg-gray-100"
          />
          <button
            onClick={(e) => handleRemoveCategory(cat._id, e)}
            className="absolute top-1 right-1 text-red-600 font-bold"
          >
            <X size={16} />
          </button>
          <p className="mt-2 text-center">{cat.category_name}</p>
        </div>
      ))}

      {/* Thêm danh mục */}
      <div
        className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-5xl text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition"
        onClick={() => fileInputRef.current.click()}
      >
        +
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleAddCategory}
      />
    </div>
  </div>
);

};

export default CategoryList;
