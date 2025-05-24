import React, { useState, useEffect } from 'react';

const Slider = () => {
  const banners = [
    `${process.env.PUBLIC_URL}/images/banner1.jpg`,
    `${process.env.PUBLIC_URL}/images/banner2.jpg`,
    `${process.env.PUBLIC_URL}/images/banner3.jpg`,
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 3000); // chuyển slide sau mỗi 3 giây

    return () => clearInterval(interval); // dọn dẹp khi unmount
  }, [banners.length]);

  return (
    <div className="mt-4 relative w-full overflow-hidden rounded-md h-96">
      {banners.map((banner, index) => (
        <img
          key={index}
          src={banner}
          alt={`slider-${index}`}
          className={`w-full h-full object-cover absolute transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default Slider;
