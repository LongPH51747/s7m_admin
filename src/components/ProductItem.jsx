import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Container, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/ProductItem.css';

const ProductItem = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://82ab-2405-4802-4b2-2810-c468-2961-3771-9afb.ngrok-free.app/api/products/get-all-products', {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      setProducts(response.data);
      console.log("Response data:", response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoading(true);
        await axios.delete(`https://82ab-2405-4802-4b2-2810-c468-2961-3771-9afb.ngrok-free.app/api/products/delete-product-by-id/id/${productId}`, {
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

  if (loading) {
    return (
      <div className="loading-state">
        <span>Đang tải...</span>
      </div>
    );
  }

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
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card className="product-card">
              <div className="product-image-container">
                <CardMedia
                  component="img"
                  height="280"
                  image={product.product_image || 'https://via.placeholder.com/280'}
                  alt={product.product_name}
                  className="product-image"
                />
                <div className="product-actions">
                  <Link to={`/product/${product._id}`} className="action-button">
                    <IconButton className="view-button">
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <Link to={`/edit-product/${product._id}`} className="action-button">
                    <IconButton className="edit-button">
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