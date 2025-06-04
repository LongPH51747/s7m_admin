import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ProductItem.css';

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.ID_Product}`);
  };

  return (
    <div className="product-item" onClick={handleClick}>
      <img src={`/images/${product.Image_Cover}`} alt={product.Name_Product} />  
     <h3>{product.Name_Product}</h3>
      <p>Đã bán: {product.sold}</p>
      <p>Đánh giá: {product.rate}/5</p>
    </div>
  );
};

export default ProductItem;