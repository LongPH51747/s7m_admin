import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://4775-2405-4803-fdbd-ede0-49a3-c651-a6f1-4e8.ngrok-free.app/api';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE}/category/get-all`);
                console.log('Category API response:', res.data);

                // Kiểm tra nếu response là mảng hoặc object chứa mảng
                const data = Array.isArray(res.data) ? res.data : res.data.data || [];
                setCategories(data);
            } catch (err) {
                console.error('Lỗi lấy danh mục:', err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleClick = (slug) => {
        navigate(`/category/${slug}`);
    };

    const handleAddCategory = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newCategoryName = prompt('Tên danh mục sản phẩm mới:');
                if (newCategoryName) {
                    const newCategory = {
                        slug: newCategoryName.toLowerCase(),
                        name: newCategoryName,
                        src: e.target.result
                    };

                    try {
                        const response = await axios.post(`${API_BASE}/category/add`, newCategory);
                        setCategories([...categories, response.data]);
                    } catch (error) {
                        console.error('Lỗi thêm danh mục:', error);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await axios.delete(`${API_BASE}/category/delete/${id}`);
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (err) {
                console.error('Lỗi xóa danh mục:', err);
            }
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-4 gap-4">
                {Array.isArray(categories) && categories.map(cat => (
                    <div
                        key={cat.id}
                        className="border rounded-lg p-2 relative cursor-pointer"
                        onClick={() => handleClick(cat.slug)}
                    >
                        <img
                            src={cat.src?.startsWith('data:image') ? cat.src : `${process.env.PUBLIC_URL}${cat.src}`}
                            alt={cat.name}
                            className="rounded w-full h-48 object-contain bg-gray-100"
                        />
                        <button
                            className="absolute top-1 right-1 text-red-600 font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCategory(cat.id);
                            }}
                        >
                            <X size={16} />
                        </button>
                        <p className="mt-2 text-center">{cat.name}</p>
                    </div>
                ))}

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
