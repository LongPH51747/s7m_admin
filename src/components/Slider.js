import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Slider = () => {
  const banners = [
    { id: 1, image: `${process.env.PUBLIC_URL}/images/banner1.jpg` },
    { id: 2, image: `${process.env.PUBLIC_URL}/images/banner3.jpg` },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Danh mục Banner</h2>
      <div className="flex items-center gap-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`relative w-72 h-44 rounded-md overflow-hidden shadow-md transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <img
              src={banner.image}
              alt={`banner-${banner.id}`}
              className="object-cover w-full h-full"
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
              aria-label="Remove banner"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {/* Ô thêm mới sản phẩm với nút cộng lớn và đẹp hơn */}
        <div className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition w-72 h-44">
          <span className="text-6xl font-light">+</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;