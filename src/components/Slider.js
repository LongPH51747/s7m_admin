import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const Slider = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const handleAddBanner = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newBanner = { image: e.target.result };

        const response = await axios.post('http://localhost:5000/banners', newBanner);
        setBanners([...banners, response.data]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
      await axios.delete(`http://localhost:5000/banners/${id}`);
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

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
              src={banner.image.startsWith('data:image') ? banner.image : `${process.env.PUBLIC_URL}${banner.image}`}
              alt={`banner-${banner.id}`}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleRemoveBanner(banner.id)}
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
              aria-label="Remove banner"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <div
          className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition w-72 h-44"
          onClick={() => fileInputRef.current.click()}
        >
          <span className="text-6xl font-light">+</span>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAddBanner}
        />
      </div>
    </div>
  );
};

export default Slider;
