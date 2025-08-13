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
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  // Gọi API lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Lọc và sắp xếp sản phẩm khi có thay đổi
  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy, priceRange]);

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
          variant_stock = product.product_variant.reduce((sum, v) => sum + (parseInt(v.variant_quantity) || 0), 0);
        }
        return { ...product, variant_stock };
      });

      const totalStock = productsWithStock.reduce((sum, product) => sum + product.variant_stock, 0);
      setTotalStock(totalStock);
      setProducts(productsWithStock);
      console.log("Response data:", productsWithStock);
      console.log("Total stock:", totalStock);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Hàm lọc và sắp xếp sản phẩm
  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Lọc theo từ khóa tìm kiếm (không phân biệt hoa thường)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo khoảng giá
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

    // Sắp xếp sản phẩm
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
      default:
        // Giữ nguyên thứ tự ban đầu
        break;
    }

    setFilteredProducts(filtered);
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
        <Typography variant="h4" component="h2">
          Danh sách sản phẩm
        </Typography>
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
                  <Typography
                    variant="body2"
                    className="product-quantity"
                    sx={{ color: '#1976d2', fontWeight: 500, mt: 1 }}
                  >
                    Tổng số lượng trong kho: {product.variant_stock?.toLocaleString('vi-VN')}
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