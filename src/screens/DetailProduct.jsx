import React, { useState } from 'react';
import '../css/DetailProduct.css';
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

const images = [
  "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
  "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667336.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzHDVMvSdZUmjR8g6gQ1fCZ8Yph8uUKmYBDdHc0IpBwFrF18DagmGXOXqLxXUoFjHIsKM&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqCjXZYUI82fYoPKkhQ5ECpmljxV4ReNuibFzUnTVyBTE0XlcQ-AilSi-whEh3f-0VMa4&usqp=CAU",
];

const comments = [
  {
    user: "dinhbao08",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    date: "20-1-2025",
    color: "Xanh",
    size: "M",
    content: "Lần đầu tiên mua sản phẩm của shop mà ưng quá cả nhà ơi. Màu xanh navi mặc tone da cực kì luôn ạ. Mặc có vuông nhìn người gọn lắm nha. Đáng ủng hộ shop ạ",
    images: [
      "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
      "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667336.jpg"
    ]
  },
  {
    user: "lelong113",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 4,
    date: "20-1-2025",
    color: "Xanh",
    size: "M",
    content: "Lần đầu tiên mua sản phẩm của shop mà ưng quá cả nhà ơi. Màu xanh navi mặc tone da cực kì luôn ạ. Mặc có vuông nhìn người gọn lắm nha. Đáng ủng hộ shop ạ",
    images: [
      "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg"
    ]
  },
  // Thêm 10 bình luận mẫu
  ...Array.from({ length: 10 }).map((_, i) => ({
    user: `user${i + 1}`,
    avatar: `https://randomuser.me/api/portraits/men/${40 + i}.jpg`,
    rating: (i % 5) + 1,
    date: `1-${i + 1}-2025`,
    color: ["Xanh", "Đỏ", "Vàng"][i % 3],
    size: ["M", "L", "XL"][i % 3],
    content: `Bình luận mẫu số ${i + 1} về sản phẩm. Sản phẩm rất tốt, mình rất hài lòng!`,
    images: [
      "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg"
    ]
  }))
];

const DetailProduct = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedRating, setSelectedRating] = useState('Tất cả');

  const handlePrev = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx) => {
    setCurrentImg(idx);
  };

  const filteredComments = selectedRating === "Tất cả"
    ? comments
    : comments.filter(c => `${c.rating} sao` === selectedRating);

  return (
    <>
      <TopBar />
      <div className="detail-container">
        <div className="image-section">
          <div className="carousel">
            <button className="arrow" onClick={handlePrev}>{'<'}</button>
            <img src={images[currentImg]} alt="product" />
            <button className="arrow" onClick={handleNext}>{'>'}</button>
          </div>
          <div className="dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={currentImg === idx ? "active-dot" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => handleDotClick(idx)}
              >
                {currentImg === idx ? "⦿" : "⭘"}
              </span>
            ))}
          </div>
          <div className="rating-section left-rating">
            <div className="rating-summary">
              <span>⭐ 4 trên 5 sao</span> <small>(150 Reviews)</small>
            </div>
            <div className="rating-filters">
              {['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao'].map((label) => (
                <button
                  key={label}
                  className={selectedRating === label ? "rating-btn active" : "rating-btn"}
                  onClick={() => setSelectedRating(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Áo len cổ lọ phong cách châu Âu...</h2>
          <p className="price">200.000VND</p>

          <div className="select-row">
            <label>Màu sắc</label>
            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
              <option value="">Chọn màu</option>
              <option value="Đen">Đen</option>
              <option value="Trắng">Trắng</option>
              <option value="Xám">Xám</option>
            </select>
          </div>

          <div className="select-row">
            <label>Size:</label>
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="select-row">
          <label>Số lượng:</label>
          <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: '60px', padding: '4px' }}
          />
          </div>


          <div className="description">
            <h3>Mô tả sản phẩm</h3>
            <p>Áo phông trơn nam logo thêu chất cotton , chuẩn form, trẻ trung, thanh lịch</p>
            <ul>
              <li>THÔNG TIN CHI TIẾT</li>
              <li>🟩 HƯỚNG DẪN CÁCH ĐẶT HÀNG</li>
              <li>📏 Cách chọn size: Shop có bảng size mẫu. Bạn NÊN INBOX, cung cấp chiều cao, cân nặng để SHOP TƯ VẤN SIZE</li>
              <li>📦 Cách đặt hàng: Nếu bạn muốn mua 2 sản phẩm khác nhau hoặc 2 size khác nhau, dễ được freeship</li>
              <li>- Khi giỏ hàng đã có đầy đủ các sản phẩm cần mua, bạn mới tiến hành nhấn nút "Thanh toán"</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="comments-section-wrapper">
        <div className="comments-section">
          {filteredComments.length === 0 && (
            <div style={{ color: "#888", margin: "16px 0" }}>Chưa có bình luận phù hợp.</div>
          )}
          {filteredComments.map((c, idx) => (
            <div className="comment" key={idx}>
              <div className="comment-header">
                <img src={c.avatar} alt={c.user} className="comment-avatar" />
                <div>
                  <div className="comment-user">{c.user}</div>
                  <div className="comment-meta">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < c.rating ? "#ffc107" : "#ddd" }}>★</span>
                    ))}
                    <span style={{ marginLeft: 8 }}>{c.date} | Màu {c.color} | Size {c.size}</span>
                  </div>
                </div>
              </div>
              <div className="comment-content">{c.content}</div>
              <div className="comment-images">
                {c.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="comment-img" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailProduct;
