import React from 'react';

const categories = [
  { id: 1, name: 'Dresses', src: `${process.env.PUBLIC_URL}/images/dresses.jpg` },
  { id: 2, name: 'T-shirt', src: `${process.env.PUBLIC_URL}/images/tshirt.jpg` },
  { id: 3, name: 'Coats', src: `${process.env.PUBLIC_URL}/images/coats.jpg` },
  { id: 4, name: 'Pajamas', src: `${process.env.PUBLIC_URL}/images/pajamas.jpg` },
];

const CategoryList = () => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
    <div className="grid grid-cols-4 gap-4">
      {categories.map((cat) => (
        <div key={cat.id} className="border rounded-lg p-2 relative">
          <img
            src={cat.src}
            alt={cat.name}
            className="rounded w-full h-48 object-contain bg-gray-100"
          />
          <span className="absolute top-1 right-1 cursor-pointer text-red-600 font-bold">✖</span>
          <p className="mt-2 text-center">{cat.name}</p>
        </div>
      ))}
    </div>
    <button className="border rounded p-2 mt-6">Xem thêm</button>
  </div>
);

export default CategoryList;
