import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const EditProductPage = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${API_URL}/${categorySlug}/${productId}`);
      setProduct(res.data);
      setName(res.data.name);
      setPrice(res.data.price);
      setImgUrl(res.data.img);
      setPreview(res.data.img);
    };
    fetchProduct();
  }, [categorySlug, productId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    setImgUrl('');
    setPreview(URL.createObjectURL(file));
  };

  const handleImgUrlChange = (e) => {
    setImgUrl(e.target.value);
    setImgFile(null);
    setPreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || (!imgFile && !imgUrl)) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const img = imgFile ? URL.createObjectURL(imgFile) : imgUrl;

    const updatedProduct = {
      ...product,
      name,
      price: parseFloat(price),
      img,
    };

    await axios.put(`${API_URL}/${categorySlug}/${productId}`, updatedProduct);
    navigate(`/category/${categorySlug}`);
  };

  if (!product) return <p className="text-center mt-10">Đang tải dữ liệu sản phẩm...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Tên sản phẩm</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Giá sản phẩm</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Chọn ảnh mới (tùy chọn)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Hoặc dán link ảnh</label>
          <input
            type="text"
            value={imgUrl}
            onChange={handleImgUrlChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        {preview && (
          <div>
            <p className="font-semibold mb-1">Xem trước ảnh:</p>
            <img src={preview} alt="preview" className="w-60 h-40 object-cover rounded border" />
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
