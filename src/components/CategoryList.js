import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([
    { slug: 'dresses', name: 'Dresses', src: `${process.env.PUBLIC_URL}/images/dresses.jpg` },
    { slug: 'tshirt', name: 'T-shirt', src: `${process.env.PUBLIC_URL}/images/tshirt.jpg` },
    { slug: 'coats', name: 'Coats', src: `${process.env.PUBLIC_URL}/images/coats.jpg` },
    { slug: 'pajamas', name: 'Pajamas', src: `${process.env.PUBLIC_URL}/images/pajamas.jpg` },
  ]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  const handleAddCategory = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newCategoryName = prompt('Tên danh mục sản phẩm mới:');
        if (newCategoryName) {
          setCategories((prevCategories) => [
            ...prevCategories,
            { slug: newCategoryName.toLowerCase(), name: newCategoryName, src: e.target.result },
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCategory = (slug) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.slug !== slug));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="border rounded-lg p-2 relative cursor-pointer"
            onClick={() => handleClick(cat.slug)}
          >
            <img
              src={cat.src}
              alt={cat.name}
              className="rounded w-full h-48 object-contain bg-gray-100"
            />
            <button
              className="absolute top-1 right-1 text-red-600 font-bold"
              aria-label="Remove category"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCategory(cat.slug);
              }}
            >
              <X size={16} />
            </button>
            <p className="mt-2 text-center">{cat.name}</p>
          </div>
        ))}

        {/* Ô thêm mới danh mục */}
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
      <button className="border rounded p-2 mt-6">Xem thêm</button>
    </div>
  );
};

export default CategoryList;
