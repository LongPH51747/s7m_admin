import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  getAllBanners,
  addBanner,
  deleteBannerById
} from '../services/bannerService';
import { ChevronDown, ChevronUp } from 'lucide-react';


const Slider = () => {
  const [banners, setBanners] = useState([]);
  const [showAll, setShowAll] = useState(false); 
  const fileInputRef = useRef(null);

  const formatBase64 = (base64, type = 'image/png') => {
    if (!base64 || typeof base64 !== 'string') return '';
    return base64.startsWith('data:image')
      ? base64
      : `data:${type};base64,${base64}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBanners();
        const array = Array.isArray(data) ? data : data.data || [];
        const formatted = array.map(b => ({
          ...b,
          banner_image_base64: formatBase64(b.banner_image_base64, b.banner_image_type)
        }));
        setBanners(formatted);
      } catch (err) {
        console.error('GET error:', err);
        setBanners([]);
      }
    };

    fetchData();
  }, []);

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

      const isConfirmed = window.confirm('Bạn có muốn thêm banner không?');
      if (!isConfirmed) return;

      try {
        const newItem = await addBanner(newBanner);
        setBanners(prev => [
          ...prev,
          {
            ...newItem,
            banner_image_base64: formatBase64(newItem.banner_image_base64, newItem.banner_image_type)
          }
        ]);
        window.location.reload();
      } catch (error) {
        console.error('POST error:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này không?')) return;

    try {
      await deleteBannerById(id);
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('DELETE error:', err);
    }
  };

  const visibleBanners = showAll ? banners : banners.slice(0, 3); 

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh mục Banner</h2>
        {banners.length > 3 && !showAll && (
  <button
    onClick={() => setShowAll(true)}
    className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 shadow"
  >
    <ChevronDown size={16} /> Xem thêm
  </button>
)}

{showAll && (
  <button
    onClick={() => setShowAll(false)}
    className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 shadow"
  >
    <ChevronUp size={16} /> Thu gọn
  </button>
)}

      </div>

      <div className="flex flex-wrap gap-4">
        {visibleBanners.map((banner) => (
          <div
            key={banner._id}
            className="relative w-72 h-44 rounded-md overflow-hidden shadow-md opacity-100"
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
