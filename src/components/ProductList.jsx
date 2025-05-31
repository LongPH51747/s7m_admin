import React, { useRef, useEffect } from "react";
import "../css/ProductList.css";

const newProducts = [
  {
    title: "Claudette corset shirt dress",
    price: "$120",
    oldPrice: "$150",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Tailored mini skirt",
    price: "$96",
    oldPrice: "$160",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Asymmetric coat",
    price: "$370",
    oldPrice: "$490",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "White long dress",
    price: "$375",
    oldPrice: "$400",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "White long dress",
    price: "$375",
    oldPrice: "$400",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "White long dress",
    price: "$375",
    oldPrice: "$400",
    img: "https://sakurafashion.vn/upload/a/7683-twenty-five-1599.jpg",
    rating: 4.8,
    reviews: 98,
  },
];

const bestSellers = [
  {
    title: "The north coat",
    price: "$260",
    oldPrice: "$390",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Gucci duffle bag",
    price: "$960",
    oldPrice: "$1160",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Orange tailored suit",
    price: "$160",
    oldPrice: "$170",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Mini skirt with stripes",
    price: "$360",
    oldPrice: "$400",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Black silk dress",
    price: "$420",
    oldPrice: "$500",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
  {
    title: "Black silk dress",
    price: "$420",
    oldPrice: "$500",
    img: "https://watermark.lovepik.com/photo/20211208/large/lovepik-fashionable-womens-clothing-picture_501667331.jpg",
    rating: 4.8,
    reviews: 98,
  },
];

const ProductList = () => {
  // Tạo ref cho cả hai hàng sản phẩm
  const newRowRef = useRef(null);
  const allRowRef = useRef(null);

  useEffect(() => {
    // Hàm xử lý sự kiện lăn chuột
    const handleWheel = (rowElement) => (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      rowElement.scrollLeft += e.deltaY;
    };

    const newRow = newRowRef.current;
    const allRow = allRowRef.current;

    // Thêm event listener cho cả hai hàng nếu tồn tại
    if (newRow) newRow.addEventListener("wheel", handleWheel(newRow), { passive: false });
    if (allRow) allRow.addEventListener("wheel", handleWheel(allRow), { passive: false });

    // Cleanup function để gỡ bỏ event listener khi component unmount
    return () => {
      if (newRow) newRow.removeEventListener("wheel", handleWheel(newRow));
      if (allRow) allRow.removeEventListener("wheel", handleWheel(allRow));
    };
  }, []); // Dependency array rỗng nghĩa là effect chỉ chạy 1 lần sau render đầu tiên

  return (
    <div className="product-container">
      <h2>Sản phẩm mới nhất</h2>
      {/* Gán ref cho hàng "Sản phẩm mới nhất" */}
      <div className="product-row" ref={newRowRef}>
        {newProducts.map((item, index) => (
          <div key={index} className="card">
            <div className="img-wrapper">
              <img src={item.img} alt="product" />
              <button className="add-to-cart-btn">Mua hàng</button>
            </div>
            <p className="title">{item.title}</p>
            <p className="price">
              <b className="price-red">{item.price}</b> <s>{item.oldPrice}</s>
            </p>
            <div className="rating">
              <span className="star">★</span>
              <span className="rating-value">{item.rating}</span>
              <span className="reviews">({item.reviews})</span>
            </div>
          </div>
        ))}
      </div>

      {/* <h2>Tất cả</h2> */}
      {/* Giữ lại nút/link Xem tất cả */}
      <a href="/ViewAll" className="view-all-button">Xem tất cả</a>
      <div className="product-row" ref={allRowRef}>
        {bestSellers.map((item, index) => (
          <div key={index} className="card">
            <div className="img-wrapper">
              <img src={item.img} alt="product" />
              <button className="add-to-cart-btn">Mua hàng</button>
            </div>
            <p className="title">{item.title}</p>
            <p className="price">
              <b className="price-red">{item.price}</b> <s>{item.oldPrice}</s>
            </p>
            <div className="rating">
              <span className="star">★</span>
              <span className="rating-value">{item.rating}</span>
              <span className="reviews">({item.reviews})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
