import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById, getVariantsByProductId } from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await getProducts();
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId) => {
    const product = await getProductById(productId);
    const variants = await getVariantsByProductId(productId);
    return { product, variants };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    currentVariants: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload.product;
        state.currentVariants = action.payload.variants;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;