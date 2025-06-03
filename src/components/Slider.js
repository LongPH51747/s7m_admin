import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://4775-2405-4803-fdbd-ede0-49a3-c651-a6f1-4e8.ngrok-free.app/api/banner';

const Slider = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef = useRef(null);

  // Sửa lỗi: Kiểm tra kiểu dữ liệu an toàn
  const formatBase64 = (base64, type = 'image/png') => {
    if (!base64 || typeof base64 !== 'string') return '';
    return base64.startsWith('data:image')
      ? base64
      : `data:${type};base64,${base64}`;
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get-all-banner`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const formatted = data.map(b => ({
          ...b,
          banner_image_base64: formatBase64(b.banner_image_base64, b.banner_image_type)
        }));

        setBanners(formatted);
      })
      .catch(err => {
        console.error('GET error:', err);
        setBanners([]);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (banners.length ? (prev + 1) % banners.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const handleAddBanner = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Full = e.target.result;
      const base64Only = base64Full.split(',')[1];

      const newBanner = {
        banner_name: file.name,
        banner_image_base64: base64Only,
        banner_image_type: file.type
      };

      try {
        const res = await axios.post(`${API_BASE_URL}/add-banner`, newBanner);
        const newItem = res.data;

        setBanners(prev => [
          ...prev,
          {
            ...newItem,
            banner_image_base64: formatBase64(newItem.banner_image_base64, newItem.banner_image_type)
          }
        ]);
      } catch (error) {
        console.error('POST error:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này không?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/delete-banner-by-id/id/${id}`);
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('DELETE error:', err);
    }
  };
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Danh mục Banner</h2>
      <div className="flex flex-wrap gap-4">
        {banners.map((banner, index) => (
          <div
          key={banner._id}
            className={`relative w-72 h-44 rounded-md overflow-hidden shadow-md transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <img
              src={banner.banner_image_url}
              alt={banner.banner_name}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleRemoveBanner(banner._id)}
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <div
          onClick={() => fileInputRef.current.click()}
          className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg text-5xl text-gray-400 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition w-72 h-44"
        >
          +
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
