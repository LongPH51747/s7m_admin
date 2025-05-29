import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const AddProductPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (imgFile) {
      const objectUrl = URL.createObjectURL(imgFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imgFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgUrl('');
    }
  };

  const handleImgUrlChange = (e) => {
    const url = e.target.value;
    setImgUrl(url);
    setImgFile(null);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || (!imgFile && !imgUrl)) {
      alert("Vui lòng nhập đầy đủ thông tin và ảnh.");
      return;
    }

    const imageSrc = imgFile ? URL.createObjectURL(imgFile) : imgUrl;

    const newProduct = {
      name,
      price: parseFloat(price),
      img: imageSrc,
    };

    await axios.post(`${API_URL}/${categorySlug}`, newProduct);
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm vào: {categorySlug}</h2>

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
          <label className="block font-semibold mb-1">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Chọn ảnh từ máy</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <label className="block font-semibold mb-1">Hoặc nhập link ảnh</label>
          <input
            type="text"
            value={imgUrl}
            onChange={handleImgUrlChange}
            className="border rounded px-3 py-2 w-full"
            placeholder="/images/abc.jpg hoặc https://..."
          />
        </div>

        {preview && (
          <div>
            <p className="font-semibold mb-1">Xem trước ảnh:</p>
            <img
              src={preview}
              alt="preview"
              className="w-60 h-40 object-cover border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
