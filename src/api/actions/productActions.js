// src/api/actions/productActions.js
import {
  fetchProducts,
  fetchProductById,
  fetchVariantsByProductId
} from '../../services/productService';

import {
  getProductsSuccess,
  getProductsFail,
  getProductDetailsSuccess,
  getProductDetailsFail,
  setLoading
} from '../reducers/productReducer';

export const getProducts = () => async (dispatch) => {
  try {
    const products = await fetchProducts();
    dispatch(getProductsSuccess(products));
  } catch (error) {
    dispatch(getProductsFail(error.message));
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    const product = await fetchProductById(id);
    const variants = await fetchVariantsByProductId(id);
    
    dispatch(getProductDetailsSuccess({ product, variants }));
  } catch (error) {
    dispatch(getProductDetailsFail(error.message));
  }
};