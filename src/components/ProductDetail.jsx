import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://bd53-2405-4802-4b2-2810-257c-7231-d6d4-719c.ngrok-free.app/api/products/get/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        setProduct(response.data);
        if (response.data.product_variant && response.data.product_variant.length > 0) {
          setSelectedColor(response.data.product_variant[0].variant_color);
          setSelectedSize(response.data.product_variant[0].variant_size);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <span>Đang tải...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-state">
        <span>Không tìm thấy sản phẩm</span>
      </div>
    );
  }

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    alert('Đã thêm vào giỏ hàng!');
  };

  const thumbnails = [
    product.product_image,
    ...(product.product_variant?.map(v => v.variant_image_url) || [])
  ].filter(Boolean);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left side - Product Images */}
        <Grid item xs={12} md={6}>
          <Box className="product-images">
            <Box className="main-image-container">
              <img
                src={thumbnails[currentImage] || 'https://via.placeholder.com/600'}
                alt={product.product_name}
                className="main-image"
              />
            </Box>
            <Box className="thumbnail-container">
              {thumbnails.map((image, index) => (
                <Box
                  key={index}
                  className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right side - Product Info */}
        <Grid item xs={12} md={6}>
          <Box className="product-info">
            <Typography variant="h4" component="h1" className="product-title">
              {product.product_name}
            </Typography>
            
            <Box className="rating-section">
              <Rating value={4} readOnly precision={0.5} />
              <Typography component="span" className="review-count">
                (150 Đánh giá)
              </Typography>
            </Box>

            <Typography variant="h4" className="product-price">
              {product.product_price?.toLocaleString('vi-VN')} VNĐ
            </Typography>

            <Box className="product-description">
              <Typography variant="body1">
                {product.product_description}
              </Typography>
            </Box>

            <Box className="variant-section">
              <Typography variant="subtitle1" className="variant-title">
                Màu sắc
              </Typography>
              <Box className="color-options">
                {[...new Set(product.product_variant?.map(v => v.variant_color))].map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" className="variant-title">
                Size
              </Typography>
              <Box className="size-options">
                {[...new Set(product.product_variant?.map(v => v.variant_size))].map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                  />
                ))}
              </Box>
            </Box>

            <Box className="quantity-section">
              <Typography variant="subtitle1" className="quantity-title">
                Số lượng
              </Typography>
              <Box className="quantity-controls">
                <IconButton 
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography className="quantity-display">{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange('increase')}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Box className="action-buttons">
              <Button 
                variant="contained" 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedSize}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outlined" className="buy-now-btn">
                Mua ngay
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 