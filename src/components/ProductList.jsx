import React from "react";
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
  return (
    <div className="product-container">
      <div className="top-stats">
        <div className="stat-box">Tổng sản phẩm: <b>1000</b></div>
        <div className="stat-box">Tổng đơn hàng hôm nay: <b>10</b></div>
        <div className="stat-box">Doanh thu: <b>2.000.000Đ</b></div>
      </div>

      <h2>Sản phẩm mới nhất</h2>
      <div className="product-row">
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

      <h2>Bán chạy nhất</h2>
      <div className="product-row">
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
