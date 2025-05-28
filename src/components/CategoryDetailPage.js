import React from 'react';
import { FiEdit2, FiTrash } from 'react-icons/fi'; 

const productData = {
        dresses: [
          {
            id: 1,
            name: 'Claudette corset shirt dress in white',
            price: 79.95,
            img: `${process.env.PUBLIC_URL}/images/dresses.jpg`,
          },
          {
            id: 2,
            name: 'Sordec dress in marigold',
            price: 119.0,
            img: '/images/product2.jpg',
          },
          {
            id: 3,
            name: 'Strapless corset bustier top in white',
            price: 59.95,
            img: '/images/product3.jpg',
          },
          {
            id: 4,
            name: 'High neck draped mini dress in black',
            price: 89.95,
            img: '/images/product4.jpg',
          },
        ],
        tshirt: [
          {
            id: 1,
            name: 'Basic cotton t-shirt in white',
            price: 19.99,
            img: '/images/tshirt1.jpg',
          },
          {
            id: 2,
            name: 'Graphic print t-shirt in black',
            price: 24.99,
            img: '/images/tshirt2.jpg',
          },
          {
            id: 3,
            name: 'Oversized t-shirt in blue',
            price: 22.5,
            img: '/images/tshirt3.jpg',
          },
          {
            id: 4,
            name: 'V-neck slim fit t-shirt',
            price: 18.75,
            img: '/images/tshirt4.jpg',
          },
        ],
        coats: [
          {
            id: 1,
            name: 'Long wool blend coat in camel',
            price: 149.99,
            img: '/images/coat1.jpg',
          },
          {
            id: 2,
            name: 'Puffer coat with hood',
            price: 129.0,
            img: '/images/coat2.jpg',
          },
          {
            id: 3,
            name: 'Double-breasted trench coat',
            price: 169.95,
            img: '/images/coat3.jpg',
          },
          {
            id: 4,
            name: 'Faux fur coat in beige',
            price: 139.5,
            img: '/images/coat4.jpg',
          },
        ],
        pajamas: [
          {
            id: 1,
            name: 'Soft cotton pajama set - pink',
            price: 39.99,
            img: '/images/pajama1.jpg',
          },
          {
            id: 2,
            name: 'Silky satin pajama in navy',
            price: 49.5,
            img: '/images/pajama2.jpg',
          },
          {
            id: 3,
            name: 'Checked flannel pajama set',
            price: 45.0,
            img: '/images/pajama3.jpg',
          },
          {
            id: 4,
            name: 'Short sleeve pajama in grey',
            price: 34.75,
            img: '/images/pajama4.jpg',
          },
        ]
      
};

const CategoryDetailPage = ({ categorySlug }) => {
  const products = productData[categorySlug] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Các sản phẩm của danh mục: {categorySlug}</h2>
      <div className="grid grid-cols-5 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-3 shadow relative hover:shadow-md transition"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <FiEdit2 className="text-gray-700 hover:text-blue-500 cursor-pointer" />
              <FiTrash className="text-gray-700 hover:text-red-500 cursor-pointer" />
            </div>
            <p className="mt-3 font-semibold">{p.price.toFixed(2)}$</p>
            <p className="text-sm text-gray-700">{p.name}</p>
          </div>
        ))}

        {/* Ô thêm mới sản phẩm */}
        <div className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-5xl text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition">
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
