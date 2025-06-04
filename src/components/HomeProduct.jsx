import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../api/reducers/productReducer'; // Update import path
import ProductItem from '../components/ProductItem'; // Simplified import path
import '../css/HomeProduct.css';

const HomeProduct = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="home-product">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-list">
        {items.map((product) => (
          <ProductItem key={product.ID_Product} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProduct;