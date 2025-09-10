// Import các hook và thư viện cần thiết
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // Gọi API
import { useParams } from "react-router-dom"; // Lấy tham số từ URL (id sản phẩm)
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Container,
  Chip,
  Fade,
  Zoom,
  Slide,
  Paper,
  Stack,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Rating,
  Alert,
  Avatar,
} from "@mui/material"; // Component UI từ Material UI
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  Edit, 
  Settings,
  Inventory,
  FavoriteRounded,
  ShareRounded,
  ZoomInRounded,
  ColorLensRounded,
  StraightenRounded,
  InfoRounded,
  RecommendRounded,
  CategoryRounded,
} from "@mui/icons-material"; // Icon điều hướng hình ảnh
import { useNavigate } from "react-router-dom"; // Điều hướng
import TopBar from "../components/TopBar"; // Thanh topbar của trang
import "../css/DetailProduct.css"; // CSS riêng cho trang này
import { ENDPOINTS, API_BASE } from "../config/api"; // Các URL API định nghĩa sẵn
import CommentSection from "../components/CommentSection";

// Hàm xử lý đường dẫn ảnh cho biến thể sản phẩm
const formatImageData = (variant) => {
  if (!variant) return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format";

  // Ưu tiên sử dụng variant_image_url nếu có
  if (variant.variant_image_url) {
    return variant.variant_image_url.startsWith("http")
      ? variant.variant_image_url
      : `${API_BASE}${variant.variant_image_url}`;
  }

  // Nếu không có, sử dụng product_image nếu tồn tại
  if (variant.product_image) {
    return variant.product_image.startsWith("http")
      ? variant.product_image
      : `${API_BASE}${variant.product_image}`;
  }

  // Nếu không có ảnh nào hợp lệ, trả về ảnh mặc định đẹp
  return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format";
};

// Component Loading Animation đẹp
const LoadingSpinner = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 3
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#6366f1',
          animation: 'spin 2s linear infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
    </Box>
    <Typography 
      variant="h6" 
      sx={{ 
        color: '#6366f1',
        fontWeight: 600,
        animation: 'fadeInUp 0.8s ease-out'
      }}
    >
      Đang tải sản phẩm...
    </Typography>
  </Box>
);

// Khởi tạo component chính
const ProductDetail = () => {
  // Lấy ID từ URL và navigate
  const { id } = useParams();
  const navigate = useNavigate();

  // Khởi tạo các state cần thiết để quản lý dữ liệu
  const [product, setProduct] = useState(null); // Thông tin sản phẩm
  const [variants, setVariants] = useState([]); // Danh sách biến thể
  const [selectedColor, setSelectedColor] = useState(""); // Màu đang chọn
  const [selectedSize, setSelectedSize] = useState(""); // Size đang chọn
  const [currentPrice, setCurrentPrice] = useState(0); // Giá hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Ảnh đang hiển thị
  const [productImages, setProductImages] = useState([]); // Danh sách ảnh
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(""); // Lỗi nếu có
  const [imageLoaded, setImageLoaded] = useState(false); // Trạng thái ảnh đã load
  const [isLiked, setIsLiked] = useState(false); // Trạng thái yêu thích
  const [avgRating, setAvgRating] = useState(0); // Điểm đánh giá trung bình
  const [totalReviews, setTotalReviews] = useState(0); // Tổng số đánh giá

// Gọi API lấy thông tin sản phẩm khi component được mount
useEffect(() => {
  const fetchProductData = async () => {
    try {
      const response = await axios.get(ENDPOINTS.GET_PRODUCT_BY_ID(id), {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json"
        },
      });

      const productData = response.data;
      const productVariants = productData.product_variant || [];

      setProduct(productData);
      setVariants(productVariants);

      // Xử lý mảng ảnh từ biến thể, loại bỏ ảnh trùng lặp hoàn toàn
      let images = [];
      const seenImages = new Set();
      const seenImageNames = new Set();
      const seenImagePaths = new Set();
      
      if (productVariants.length > 0) {
        productVariants.forEach((variant) => {
          const imageUrl = formatImageData(variant);
          
          // Trích xuất tên file và đường dẫn để kiểm tra trùng lặp
          let imageName = '';
          let imagePath = '';
          
          if (imageUrl.includes('/')) {
            const urlParts = imageUrl.split('/');
            imageName = urlParts[urlParts.length - 1].split('?')[0]; // Tên file cuối cùng
            imagePath = urlParts.slice(-2).join('/').split('?')[0]; // 2 phần cuối của đường dẫn
          }
          
          // Kiểm tra trùng lặp theo nhiều tiêu chí
          const isDuplicate = 
            seenImages.has(imageUrl) || 
            (imageName && seenImageNames.has(imageName)) ||
            (imagePath && seenImagePaths.has(imagePath)) ||
            imageUrl === "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format";
          
          if (!isDuplicate) {
            seenImages.add(imageUrl);
            if (imageName) seenImageNames.add(imageName);
            if (imagePath) seenImagePaths.add(imagePath);
            images.push(imageUrl);
            console.log(`✅ Added unique image: ${imageName || imageUrl}`);
          } else {
            console.log(`❌ Skipped duplicate image: ${imageName || imageUrl}`);
          }
        });
      }
      
      // Loại bỏ ảnh trùng lặp cuối cùng bằng cách so sánh nội dung
      const finalImages = [];
      const finalSeen = new Set();
      
      images.forEach(imgUrl => {
        // Tạo key duy nhất cho mỗi ảnh
        const imageKey = imgUrl.includes('http') ? 
          imgUrl.split('/').pop().split('?')[0] : 
          imgUrl;
        
        if (!finalSeen.has(imageKey)) {
          finalSeen.add(imageKey);
          finalImages.push(imgUrl);
        }
      });
      
      // Nếu không có ảnh nào, sử dụng ảnh mặc định
      if (finalImages.length === 0) {
        finalImages.push("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format");
      }
      
      console.log(`📸 Final result: ${finalImages.length} unique images from ${productVariants.length} variants`);
      console.log('🔍 Final images:', finalImages);
      setProductImages(finalImages);

      // Thiết lập biến thể đầu tiên làm mặc định
      if (productVariants.length > 0) {
        const firstVariant = productVariants[0];
        setSelectedColor(firstVariant.variant_color);
        setSelectedSize(firstVariant.variant_size);
        setCurrentPrice(firstVariant.variant_price);
      } else {
        setCurrentPrice(productData.product_price); // Nếu không có biến thể thì dùng giá sản phẩm chính
      }
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  fetchProductData();
}, [id]);

// Gọi API lấy dữ liệu đánh giá từ comment
useEffect(() => {
  const fetchRatingData = async () => {
    try {
      const response = await axios.get(ENDPOINTS.GET_COMMENT_BY_PRODUCT_ID(id), {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json"
        },
      });
      
      const comments = response.data || [];
      
      if (comments.length > 0) {
        const total = comments.length;
        const sum = comments.reduce((acc, comment) => acc + (comment.review_rate || 0), 0);
        setAvgRating(parseFloat((sum / total).toFixed(1)));
        setTotalReviews(total);
      } else {
        setAvgRating(0);
        setTotalReviews(0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
      setAvgRating(0);
      setTotalReviews(0);
    }
  };

  fetchRatingData();
}, [id]);

// Khi chọn màu, tự động chọn size tương ứng nếu size đang chọn không hợp lệ
useEffect(() => {
  if (selectedColor && variants.length > 0) {
    const sizesForColor = variants
      .filter((v) => v.variant_color === selectedColor)
      .map((v) => v.variant_size);

    if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
  }
}, [selectedColor, variants, selectedSize]);

// Cập nhật giá và ảnh khi chọn màu và size
useEffect(() => {
  if (selectedColor && selectedSize && variants.length > 0) {
    const selectedVariant = variants.find(
      (v) =>
        v.variant_color === selectedColor && v.variant_size === selectedSize
    );

    if (selectedVariant) {
      setCurrentPrice(selectedVariant.variant_price);

      // Cập nhật index ảnh nếu biến thể có ảnh riêng
      if (selectedVariant.variant_image_url) {
        setCurrentImageIndex(
          productImages.indexOf(
            selectedVariant.variant_image_url.startsWith("http")
              ? selectedVariant.variant_image_url
              : `${API_BASE}${selectedVariant.variant_image_url}`
          )
        );
      }
    }
  }
}, [selectedColor, selectedSize, variants, productImages]);

useEffect(() => {
  if (productImages.length > 0) {
    setCurrentImageIndex(0);
  }
}, [productImages]);

// Danh sách màu có sẵn (dùng useMemo để tối ưu)
const availableColors = useMemo(
  () => [...new Set(variants.map((v) => v.variant_color))],
  [variants]
);

// Danh sách size theo màu đang chọn
const availableSizes = useMemo(() => {
  if (!selectedColor) return [];
  return [
    ...new Set(
      variants
        .filter((v) => v.variant_color === selectedColor)
        .map((v) => v.variant_size)
    ),
  ];
}, [selectedColor, variants]);

// Lấy biến thể đang chọn
const selectedVariant = useMemo(() => {
  return variants.find(
    (v) =>
      v.variant_color === selectedColor && v.variant_size === selectedSize
  );
}, [selectedColor, selectedSize, variants]);

// Lấy số lượng tồn kho của biến thể đang chọn
const variantStock = selectedVariant ? parseInt(selectedVariant.variant_stock) || 0 : 0;

// Hàm xử lý thay đổi ảnh
const handleImageChange = (direction) => {
  if (direction === 'next') {
    setCurrentImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
  } else {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
  }
  setImageLoaded(false);
};



// Component ảnh sản phẩm với hiệu ứng đẹp
const ProductImageGallery = () => (
  <Fade in={true} timeout={800}>
    <Paper
      className="product-image-box animated-fadein floating-element"
      elevation={0}
      sx={{
        width: { xs: '100%', sm: 420, md: 500, lg: 580 },
        height: { xs: 360, sm: 420, md: 500, lg: 650 },
        borderRadius: 0,
        position: 'relative',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          borderColor: '#6366f1',
        }
      }}
    >
      {/* Navigation buttons */}
      {productImages.length > 1 && (
        <>
          <IconButton
            className="nav-button prev"
            onClick={() => handleImageChange('prev')}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 3,
              width: 48,
              height: 48,
              color: '#6b7280',
              borderRadius: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: '#6366f1',
                color: '#fff',
                transform: 'translateY(-50%) scale(1.1)',
                borderColor: '#6366f1',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
              }
            }}
          >
            <ArrowBackIos sx={{ fontSize: 20 }} />
          </IconButton>

          <IconButton
            className="nav-button next"
            onClick={() => handleImageChange('next')}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 3,
              width: 48,
              height: 48,
              color: '#6b7280',
              borderRadius: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: '#6366f1',
                color: '#fff',
                transform: 'translateY(-50%) scale(1.1)',
                borderColor: '#6366f1',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
              }
            }}
          >
            <ArrowForwardIos sx={{ fontSize: 20 }} />
          </IconButton>
        </>
      )}

      {/* Main image */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          p: 2,
        }}
      >
        <Zoom in={imageLoaded} timeout={600}>
          <img
            src={productImages[currentImageIndex] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format"}
            alt={`Product ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
              filter: 'contrast(1.05) saturate(1.05)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        </Zoom>

        {/* Image loading overlay */}
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              borderRadius: 0,
              zIndex: 4,
            }}
          >
            <CircularProgress sx={{ color: '#6366f1' }} />
          </Box>
        )}
      </Box>

      {/* Dot indicators */}
      {productImages.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 3,
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #e5e7eb',
            borderRadius: 0,
            p: 1,
          }}
        >
          {productImages.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              sx={{
                width: idx === currentImageIndex ? 24 : 12,
                height: 12,
                borderRadius: 0,
                background: idx === currentImageIndex 
                  ? '#6366f1' 
                  : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: idx === currentImageIndex ? '0 0 20px rgba(99,102,241,0.6)' : 'none',
                '&:hover': {
                  transform: 'scale(1.2)',
                  background: idx === currentImageIndex 
                    ? '#6366f1' 
                    : '#9ca3af',
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Zoom icon */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #e5e7eb',
          borderRadius: 0,
          zIndex: 3,
          color: '#6b7280',
          '&:hover': {
            background: '#ffffff',
            transform: 'scale(1.1)',
            color: '#6366f1',
          }
        }}
      >
        <ZoomInRounded sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Badge/Tag */}
      <Chip
        label="Hàng mới"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 0,
          zIndex: 3,
        }}
      />
    </Paper>
  </Fade>
);

// Component thông tin sản phẩm với design đẹp
const ProductInfo = () => (
  <Slide direction="left" in={true} timeout={800}>
    <Box>
      {/* Product Basic Info Card */}
      <Paper
        className="product-info animated-slidein"
        elevation={0}
        sx={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 0,
          p: { xs: 3, md: 4 },
          mb: 3,
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* Header với tên và actions */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
            mb: 2, 
            gap: 2 
          }}>
            <Box sx={{ flex: 1, minWidth: 0, order: { xs: 1, sm: 1 } }}>
              <Typography
                variant="h3"
                className="product-name"
                sx={{
                  fontWeight: 800,
                  color: '#1f2937',
                  lineHeight: 1.3,
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  mb: 2,
                  width: '100%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  breakWord: 'break-word',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product?.product_name}
              </Typography>
            </Box>
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexShrink: 0, 
                order: { xs: 2, sm: 2 },
                alignSelf: { xs: 'flex-end', sm: 'flex-start' }
              }}
            >
              <IconButton
                onClick={() => setIsLiked(!isLiked)}
                sx={{
                  background: isLiked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: 0,
                  color: isLiked ? '#fff' : '#6366f1',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    background: isLiked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(99,102,241,0.1)',
                  }
                }}
              >
                <FavoriteRounded />
              </IconButton>
              <IconButton
                sx={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: 0,
                  color: '#6366f1',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    background: 'rgba(99,102,241,0.1)',
                  }
                }}
              >
                <ShareRounded />
              </IconButton>
            </Stack>
          </Box>

          {/* Action buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/update-product/${id}`)}
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 0,
                fontWeight: 600,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5855eb, #7c3aed)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
                }
              }}
            >
              Chỉnh sửa sản phẩm
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => navigate(`/update-variant/${id}`)}
              sx={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                borderRadius: 0,
                fontWeight: 600,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#d97706',
                  background: 'rgba(245, 158, 11, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Quản lý variants
            </Button>
          </Stack>

          {/* Rating & Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating 
                value={avgRating} 
                precision={0.1} 
                readOnly 
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#f59e0b',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#f59e0b',
                  },
                }}
              />
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, ml: 1 }}>
                {avgRating > 0 ? `${avgRating} (${totalReviews} đánh giá)` : 'Chưa có đánh giá'}
              </Typography>
            </Box>
            {avgRating >= 4.5 && totalReviews >= 5 && (
              <Chip 
                label="Bestseller" 
                size="small" 
                icon={<RecommendRounded />}
                sx={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 0
                }}
              />
            )}
            <Chip 
              label={product?.category || "Thời trang"}
              size="small" 
              icon={<CategoryRounded />}
              sx={{ 
                background: '#f1f5f9',
                color: '#4b5563',
                fontWeight: 500,
                borderRadius: 0
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }} />

        {/* Price info */}
        <Card sx={{ mb: 4, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 0 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: '#1f2937',
                fontSize: { xs: 28, md: 36 },
                mb: 1,
              }}
            >
              {currentPrice?.toLocaleString("vi-VN")} VND
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Giá hiện tại của sản phẩm
            </Typography>
          </CardContent>
        </Card>

        {/* Variant selection */}
        {availableColors.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ColorLensRounded sx={{ mr: 1, color: '#6366f1' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>
                Màu sắc
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {availableColors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "contained" : "outlined"}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 80,
                    position: 'relative',
                    overflow: 'hidden',
                    ...(selectedColor === color ? {
                      background: '#6366f1',
                      color: '#fff',
                      borderColor: '#6366f1',
                      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                    } : {
                      borderColor: '#e5e7eb',
                      color: '#374151',
                      background: '#ffffff',
                      '&:hover': {
                        borderColor: '#6366f1',
                        background: 'rgba(99,102,241,0.05)',
                        transform: 'translateY(-2px)',
                      }
                    })
                  }}
                >
                  {color}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* Size selection */}
        {availableSizes.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StraightenRounded sx={{ mr: 1, color: '#6366f1' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>
                Kích thước
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "contained" : "outlined"}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 60,
                    ...(selectedSize === size ? {
                      background: '#6366f1',
                      color: '#fff',
                      borderColor: '#6366f1',
                      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                    } : {
                      borderColor: '#e5e7eb',
                      color: '#374151',
                      background: '#ffffff',
                      '&:hover': {
                        borderColor: '#6366f1',
                        background: 'rgba(99,102,241,0.05)',
                        transform: 'translateY(-2px)',
                      }
                    })
                  }}
                >
                  {size}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* Stock info */}
        <Alert
          severity={variantStock > 10 ? "success" : variantStock > 0 ? "warning" : "error"}
          icon={<Inventory />}
          sx={{ 
            mb: 4,
            borderRadius: 0,
            background: variantStock > 10 ? '#f0fdf4' : variantStock > 0 ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${variantStock > 10 ? '#bbf7d0' : variantStock > 0 ? '#fed7aa' : '#fecaca'}`,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {variantStock} sản phẩm còn lại
            </Typography>
            <Typography variant="body2">
              {variantStock > 10 ? 'Còn nhiều hàng' : variantStock > 0 ? 'Sắp hết hàng - Đặt ngay!' : 'Tạm hết hàng'}
            </Typography>
          </Box>
        </Alert>
 
        </Paper>

      {/* Description Card */}
      <Card sx={{ border: '1px solid #e5e7eb', borderRadius: 0 }}>
        <CardHeader 
          title="Mô tả sản phẩm" 
          avatar={<Avatar sx={{ background: '#6366f1' }}><InfoRounded /></Avatar>}
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4b5563',
              lineHeight: 1.7,
              fontSize: 16,
              whiteSpace: 'pre-line'
            }}
          >
            {product?.product_description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </Slide>
);

const mainContent = (
  <Box
    sx={{
      minHeight: '100vh',
      background: '#ffffff',
      py: { xs: 2, md: 4 },
    }}
  >
    <Container maxWidth="xl">
      {product && (
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} alignItems="flex-start">
          {/* Image Gallery */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ProductImageGallery />
            </Box>
          </Grid>
          
          {/* Product Info */}
          <Grid item xs={12} lg={6}>
            <ProductInfo />
          </Grid>
        </Grid>
      )}
      
      {/* Comment Section */}
      <Fade in={true} timeout={1200}>
        <Box sx={{ mt: 8 }}>
          <CommentSection productId={id} />
        </Box>
      </Fade>
    </Container>
  </Box>
);

const loadingView = <LoadingSpinner />;

const errorView = (
  <Box className="center-content">
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 600, mb: 2 }}>
        {error}
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Thử lại
      </Button>
    </Paper>
  </Box>
);

const noProductView = (
  <Box className="center-content">
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#6b7280' }}>
        Không tìm thấy sản phẩm
      </Typography>
    </Paper>
  </Box>
);

// Trả về giao diện tổng của trang
return (
  <Box className="root-container">
    <TopBar />
    <Box sx={{ pt: '64px', minHeight: '100vh', background: '#ffffff' }}>
      {loading
        ? loadingView
        : error
        ? errorView
        : !product
        ? noProductView
        : mainContent
      }
    </Box>
  </Box>
);

};

export default ProductDetail;
