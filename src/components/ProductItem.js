import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Container, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/ProductItem.css';
import { ENDPOINTS, API_BASE } from '../config/api';

// Component hiển thị danh sách sản phẩm
const ProductItem = () => {
  // Khai báo state lưu danh sách sản phẩm và trạng thái loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(ENDPOINTS.GET_PRODUCTS, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      // Tính tổng số lượng variant cho mỗi sản phẩm và thêm thuộc tính variant_stock
      const productsWithStock = response.data.map(product => {
        let variant_stock = 0;
        if (Array.isArray(product.product_variant)) {
          variant_stock = product.product_variant.reduce((sum, v) => sum + (parseInt(v.variant_quantity) || 0), 0);
        }
        return { ...product, variant_stock };
      });
      setProducts(productsWithStock);
      console.log("Response data:", productsWithStock);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoading(true);
        await axios.delete(ENDPOINTS.DELETE_PRODUCT_BY_ID(productId), {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        alert('Xóa sản phẩm thành công!');
        
        setTimeout(async () => {
          await fetchProducts();
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
        setLoading(false);
      }
    }
  };

  // Hiển thị trạng thái loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="loading-state">
        <span>Đang tải...</span>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box className="product-header">
        <Typography variant="h4" component="h2">
          Danh sách sản phẩm
        </Typography>
        <Link to="/add-product" className="add-product-btn">
          Thêm sản phẩm
        </Link>
      </Box>
      
      <Grid container spacing={3}>
        {/* Duyệt qua từng sản phẩm để hiển thị */}
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card className="product-card">
              <div className="product-image-container">
                <CardMedia
                  component="img"
                  height="280"
                  image={
                    product.product_image
                      ? product.product_image.startsWith('http')
                        ? product.product_image
                        : `${API_BASE}${product.product_image}`
                      : 'https://via.placeholder.com/280'
                  }
                  alt={product.product_name}
                  className="product-image"
                />
                <div className="product-actions">
                  <Link to={`/product/${product._id}`} className="action-button">
                    <IconButton className="view-button">
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <Link to={`/products/edit/${product._id}`} className="action-button">
                    <IconButton className="edit-button" sx={{
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}>
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton 
                    className="delete-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(product._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              <CardContent>
                <Link to={`/product/${product._id}`} className="product-link">
                  <Typography variant="h6" className="product-name">
                    {product.product_name}
                  </Typography>
                  <Typography variant="body2" className="product-description">
                    {product.product_description?.substring(0, 50)}...
                  </Typography>
                  <Typography variant="h6" className="product-price">
                    {product.product_price?.toLocaleString('vi-VN')}VNĐ
                  </Typography>
                  <Typography
                    variant="body2"
                    className="product-quantity"
                    sx={{ color: '#1976d2', fontWeight: 500, mt: 1 }}
                  >
                    Tổng kho: {product.variant_stock}
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductItem;