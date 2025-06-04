import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../api/reducers/productReducer';
import '../css/DetailProduct.css';

const DetailProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, currentVariants, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!currentProduct) return <div>Product not found</div>;

  return (
    <div className="detail-product">
      <h1>{currentProduct.Name_Product}</h1>
      <img src={currentProduct.Image_Cover} alt={currentProduct.Name_Product} />
      <p>{currentProduct.description}</p>
      <p>Đã bán: {currentProduct.sold}</p>
      <p>Đánh giá: {currentProduct.rate}/5</p>
      
      {/* Actually use the currentVariants */}
      <h2>Các phiên bản</h2>
      <div className="variants">
        {currentVariants.map((variant) => (
          <div key={variant.ID_Variant} className="variant">
            <img src={variant.Img} alt={`${variant.Color} ${variant.Size}`} />
            <p>Màu: {variant.Color}</p>
            <p>Size: {variant.Size}</p>
            <p>Giá: {variant.Price.toLocaleString()} VND</p>
            <p>Số lượng: {variant.Amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailProduct;