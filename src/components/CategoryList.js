import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5000/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
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

                    const response = await axios.post('http://localhost:5000/categories', newCategory);
                    setCategories([...categories, response.data]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            await axios.delete(`http://localhost:5000/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-4 gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="border rounded-lg p-2 relative cursor-pointer"
                        onClick={() => handleClick(cat.slug)}
                    >
                        <img
                            src={cat.src.startsWith('data:image') ? cat.src : `${process.env.PUBLIC_URL}${cat.src}`}
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
