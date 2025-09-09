import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Container, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import '../css/ProductItem.css';
import { ENDPOINTS, API_BASE } from '../config/api';

// Component hiển thị danh sách sản phẩm
const ProductItem = () => {
  // Khai báo state lưu danh sách sản phẩm và trạng thái loading
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  
  console.log("Component state - totalStock:", totalStock, "products.length:", products.length);
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  // const [productsWithRatings, setProductsWithRatings] = useState([]);

  // Gọi API lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Bỏ effect log không cần thiết để tránh cảnh báo dependency

  // Lọc và sắp xếp sản phẩm khi có thay đổi
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.product_price || 0;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    switch (sortBy) {
      case 'price-high-low':
        filtered.sort((a, b) => (b.product_price || 0) - (a.product_price || 0));
        break;
      case 'price-low-high':
        filtered.sort((a, b) => (a.product_price || 0) - (b.product_price || 0));
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name, 'vi'));
        break;
      case 'name-z-a':
        filtered.sort((a, b) => b.product_name.localeCompare(a.product_name, 'vi'));
        break;
      case 'rating-high-low':
        filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'rating-low-high':
        filtered.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
        break;
      case 'reviews-high-low':
        filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      case 'reviews-low-high':
        filtered.sort((a, b) => (a.totalReviews || 0) - (b.totalReviews || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, priceRange]);

  // Cập nhật totalStock khi products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      const newTotalStock = products.reduce((sum, product) => {
        const stock = parseInt(product.variant_stock) || 0;
        return sum + stock;
      }, 0);
      setTotalStock(newTotalStock);
    } else {
      setTotalStock(0);
    }
  }, [products]);

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(ENDPOINTS.GET_PRODUCTS, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      // Tính tổng số lượng variant cho mỗi sản phẩm và thêm thuộc tính variant_stock
      const productsWithStock = response.data.map(product => {
        let variant_stock = 0;
        if (Array.isArray(product.product_variant)) {
          variant_stock = product.product_variant.reduce((sum, v) => {
            // Sử dụng variant_stock nếu có, nếu không thì dùng variant_quantity
            const stock = parseInt(v.variant_stock) || parseInt(v.variant_quantity) || 0;
            console.log(`Variant ${v.variant_color} ${v.variant_size}: stock = ${stock}`);
            return sum + stock;
          }, 0);
        }
        return { ...product, variant_stock };
      });

      // Lấy dữ liệu đánh giá cho từng sản phẩm
      const productsWithRatings = await Promise.all(
        productsWithStock.map(async (product) => {
          try {
            const ratingResponse = await axios.get(ENDPOINTS.GET_COMMENT_BY_PRODUCT_ID(product._id), {
              headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
              }
            });
            
            const comments = ratingResponse.data || [];
            let avgRating = 0;
            let totalReviews = 0;
            
            if (comments.length > 0) {
              const sum = comments.reduce((acc, comment) => acc + (comment.review_rate || 0), 0);
              avgRating = parseFloat((sum / comments.length).toFixed(1));
              totalReviews = comments.length;
            }
            
            return { 
              ...product, 
              avgRating,
              totalReviews
            };
          } catch (err) {
            console.error(`Lỗi khi lấy đánh giá cho sản phẩm ${product._id}:`, err);
            return { 
              ...product, 
              avgRating: 0,
              totalReviews: 0
            };
          }
        })
      );

      // Helper: convert created date to ms; fallback to ObjectId time
      const getCreatedTimeMs = (p) => {
        if (p.createdAt) {
          const t = new Date(p.createdAt).getTime();
          if (!Number.isNaN(t)) return t;
        }
        if (p.created_at) {
          const t = new Date(p.created_at).getTime();
          if (!Number.isNaN(t)) return t;
        }
        // MongoDB ObjectId first 4 bytes are a timestamp (seconds)
        if (typeof p._id === 'string' && p._id.length === 24) {
          const tsHex = p._id.substring(0, 8);
          const seconds = parseInt(tsHex, 16);
          if (!Number.isNaN(seconds)) return seconds * 1000;
        }
        return 0;
      };

      // Sort newest first so newly added products appear at the top
      const sortedProducts = [...productsWithRatings].sort((a, b) => getCreatedTimeMs(b) - getCreatedTimeMs(a));

      // Tính tổng số lượng từ dữ liệu gốc để đảm bảo chính xác
      let totalStock = 0;
      response.data.forEach(product => {
        if (Array.isArray(product.product_variant)) {
          product.product_variant.forEach(variant => {
            const stock = parseInt(variant.variant_stock) || parseInt(variant.variant_quantity) || 0;
            totalStock += stock;
          });
        }
      });
      
      setTotalStock(totalStock);
      setProducts(sortedProducts);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Đã chuyển logic lọc/sắp xếp vào useEffect ở trên

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
          await fetchProducts(); // Hàm này sẽ tự động cập nhật totalStock
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h4" component="h2">
            Danh sách sản phẩm
          </Typography>
        </Box>
        <Link to="/add-product" className="add-product-btn">
          Thêm sản phẩm
        </Link>
      </Box>

      {/* Thanh tìm kiếm và lọc */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Tìm kiếm */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              placeholder="Nhập tên sản phẩm hoặc mô tả..."
            />
          </Grid>

          {/* Sắp xếp */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp theo"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="default">Mặc định</MenuItem>
                <MenuItem value="price-high-low">Giá: Cao → Thấp</MenuItem>
                <MenuItem value="price-low-high">Giá: Thấp → Cao</MenuItem>
                <MenuItem value="name-a-z">Tên: A → Z</MenuItem>
                <MenuItem value="name-z-a">Tên: Z → A</MenuItem>
                <MenuItem value="rating-high-low">Đánh giá: Cao → Thấp</MenuItem>
                <MenuItem value="rating-low-high">Đánh giá: Thấp → Cao</MenuItem>
                <MenuItem value="reviews-high-low">Số đánh giá: Nhiều → Ít</MenuItem>
                <MenuItem value="reviews-low-high">Số đánh giá: Ít → Nhiều</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Lọc theo giá */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Khoảng giá</InputLabel>
              <Select
                value={priceRange}
                label="Khoảng giá"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="all">Tất cả giá</MenuItem>
                <MenuItem value="0-100000">Dưới 100.000đ</MenuItem>
                <MenuItem value="100000-300000">100.000đ - 300.000đ</MenuItem>
                <MenuItem value="300000-500000">300.000đ - 500.000đ</MenuItem>
                <MenuItem value="500000-1000000">500.000đ - 1.000.000đ</MenuItem>
                <MenuItem value="1000000-">Trên 1.000.000đ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Hiển thị số lượng kết quả */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {filteredProducts.length} trong tổng số {products.length} sản phẩm
          </Typography>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Duyệt qua từng sản phẩm đã lọc để hiển thị */}
        {filteredProducts.map((product) => (
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
                  
                  {/* Hiển thị đánh giá */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
                        color: '#f59e0b', 
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        ★
                      </span>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280', 
                          fontWeight: 500, 
                          ml: 0.5,
                          fontSize: '14px'
                        }}
                      >
                        {product.avgRating > 0 ? product.avgRating : 'Chưa có'}
                      </Typography>
                    </Box>
                    {product.totalReviews > 0 && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#9ca3af', 
                          fontSize: '12px'
                        }}
                      >
                        ({product.totalReviews})
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Hiển thị số lượng trong kho của sản phẩm này */}
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: '#1976d2', 
                      fontWeight: 600, 
                      mt: 1,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    📦 Tổng kho: {product.variant_stock?.toLocaleString('vi-VN') || '0'}
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hiển thị thông báo khi không có kết quả */}
      {filteredProducts.length === 0 && searchTerm && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchTerm}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hãy thử từ khóa khác hoặc điều chỉnh bộ lọc
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductItem;