import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";

const formatImageData = (variant) => {
  // Kiểm tra dữ liệu đầu vào
  if (!variant || !variant.variant_image_base64 || !variant.variant_image_type || !variant.variant_image_base64.data) {
    return 'https://placehold.co/600x400?text=No+Image';
  }

  // Sửa lỗi: Chuyển đổi mảng byte (từ Buffer.data) thành chuỗi base64 bằng API của trình duyệt
  // thay vì dùng Buffer của Node.js.
  const bytes = new Uint8Array(variant.variant_image_base64.data);
  let binary = '';
  // Lặp qua từng byte và chuyển thành ký tự
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  // Mã hóa chuỗi nhị phân thành base64
  const base64String = window.btoa(binary);

  return `data:${variant.variant_image_type};base64,${base64String}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Sửa: Khởi tạo là null
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(""); // State mới cho ảnh
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
// Effect chính để fetch dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/products/get-products-by-id/id/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        console.log(response.data)

        const productData = response.data;
        const productVariants = productData.product_variant || []; // Sửa: product_variant

        setProduct(productData);
        setVariants(productVariants);

        // Sửa: Dùng trực tiếp biến từ response, không dùng state ở đây
        if (productVariants.length > 0) {
          const firstVariant = productVariants[0];
          setSelectedColor(firstVariant.variant_color);
          setSelectedSize(firstVariant.variant_size);
          setCurrentPrice(firstVariant.variant_price);
          setCurrentImage(formatImageData(firstVariant)); // Set ảnh của biến thể đầu tiên
        } else {
          // Nếu không có biến thể, dùng giá và ảnh gốc của sản phẩm
          setCurrentPrice(productData.product_price);
          setCurrentImage(productData.product_image || 'https://placehold.co/600x400?text=No+Image');
        }

      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Effect để cập nhật size khi màu thay đổi
  useEffect(() => {
    if (selectedColor && variants.length > 0) {
      const sizesForColor = variants
        .filter(v => v.variant_color === selectedColor)
        .map(v => v.variant_size);

      // Nếu size hiện tại không có trong list size của màu mới, chọn size đầu tiên
      if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
        setSelectedSize(sizesForColor[0]);
      }
    }
  }, [selectedColor, variants, selectedSize]); // Thêm selectedSize vào dependency array


  // Effect để cập nhật giá và ảnh khi màu hoặc size thay đổi
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const selectedVariant = variants.find(
        v => v.variant_color === selectedColor && v.variant_size === selectedSize
      );
      if (selectedVariant) {
        setCurrentPrice(selectedVariant.variant_price);
        setCurrentImage(formatImageData(selectedVariant)); // Cập nhật ảnh
      }
    }
  }, [selectedColor, selectedSize, variants]);

  // Dùng useMemo để tính toán các màu và size có sẵn, tránh re-render không cần thiết
  const availableColors = useMemo(() => [...new Set(variants.map(v => v.variant_color))], [variants]);
  
  const availableSizes = useMemo(() => {
    if (!selectedColor) return [];
    return [...new Set(
      variants
        .filter(v => v.variant_color === selectedColor)
        .map(v => v.variant_size)
    )];
  }, [selectedColor, variants]);


  const handleAddToCart = () => {
    const selectedVariant = variants.find(
      v => v.variant_color === selectedColor && v.variant_size === selectedSize
    );
    console.log({
      productId: product._id, // Schema dùng _id
      variantSku: selectedVariant ? selectedVariant.variant_sku : null,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: currentPrice
    });
    // Thêm logic gọi API ở đây
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  if (!product) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Không tìm thấy sản phẩm</Typography>;
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            position: 'relative',
            paddingTop: '100%', // Tạo aspect ratio 1:1 cho ảnh
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img
              src={currentImage} // Sửa: Dùng state currentImage
              alt={product.product_name} // Sửa: product_name
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>{product.product_name}</Typography> {/* Sửa: product_name */}
          
          {/* Thuộc tính rate không có trong schema, tạm ẩn đi */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rate || 0} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>({product.rate || 0}/5)</Typography>
          </Box> */}
          
          <Typography variant="h5" color="primary" fontWeight="500" gutterBottom sx={{ my: 2 }}>
            {currentPrice.toLocaleString('vi-VN')} VND
          </Typography>
          
          {variants.length > 0 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Màu sắc</Typography>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {availableColors.map(color => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Size</Typography>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={availableSizes.length === 0}
              >
                {availableSizes.map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Số lượng</Typography>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            inputProps={{ min: 1 }}
            sx={{ mb: 3 }}
            fullWidth
          />
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            disabled={variants.length > 0 && (!selectedColor || !selectedSize)}
            fullWidth
          >
            Thêm vào giỏ hàng
          </Button>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Mô tả sản phẩm</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{product.product_description}</Typography> {/* Sửa: product_description */}
      </Box>
    </Box>
  );
};

export default ProductDetail;
