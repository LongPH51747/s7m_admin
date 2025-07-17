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
} from "@mui/material"; // Component UI từ Material UI
import { ArrowBackIos, ArrowForwardIos, Edit, Settings } from "@mui/icons-material"; // Icon điều hướng hình ảnh
import { useNavigate } from "react-router-dom"; // Điều hướng
import TopBar from "../components/TopBar"; // Thanh topbar của trang
import "../css/DetailProduct.css"; // CSS riêng cho trang này
import { ENDPOINTS, API_BASE } from "../config/api"; // Các URL API định nghĩa sẵn
import CommentSection from "../components/CommentSection";


// Hàm xử lý đường dẫn ảnh cho biến thể sản phẩm
const formatImageData = (variant) => {
  if (!variant) return "https://placehold.co/600x400?text=No+Image";

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

  // Nếu không có ảnh nào hợp lệ, trả về ảnh mặc định
  return "https://placehold.co/600x400?text=No+Image";
};


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


// Gọi API lấy thông tin sản phẩm khi component được mount
useEffect(() => {
  const fetchProductData = async () => {
    try {
      const response = await axios.get(ENDPOINTS.GET_PRODUCT_BY_ID(id), {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      const productData = response.data;
      const productVariants = productData.product_variant || [];

      setProduct(productData);
      setVariants(productVariants);

      // Xử lý mảng ảnh từ biến thể và sản phẩm chính
      let images = [];
      if (productVariants.length > 0) {
        images = productVariants.map((variant) => formatImageData(variant));
      }

      if (productData.product_image) {
        images.unshift(
          productData.product_image.startsWith("http")
            ? productData.product_image
            : `${API_BASE}${productData.product_image}`
        );
      }

      images = [...new Set(images)]; // Loại bỏ ảnh trùng lặp
      if (images.length === 0) images.push("https://placehold.co/600x400?text=No+Image");

      setProductImages(images);

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


  const mainContent = (
    <Container maxWidth="lg" sx={{ px: { xs: 1, md: 3 }, pt: { xs: 2, md: 4 }, pb: { xs: 2, md: 4 }, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {product && (
        <>
          <Grid container spacing={{ xs: 2, md: 6 }} alignItems="center" justifyContent="center" sx={{ minHeight: { md: '70vh' }, flexWrap: 'nowrap' }}>
            {/* Ảnh sản phẩm */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                className="product-image-box animated-fadein"
                sx={{
                  width: { xs: '100%', sm: 400, md: 480 },
                  maxWidth: 520,
                  minWidth: { xs: 240, sm: 320, md: 380 },
                  height: { xs: 320, sm: 400, md: 600 },
                  maxHeight: 600,
                  border: '2.5px solid #1976d2',
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #f5fafd 0%, #e3f2fd 100%)',
                  boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
                  overflow: 'hidden',
                  p: { xs: 1, md: 2 },
                  m: 0,
                }}
              >
                {/* Nút điều hướng trái */}
                {productImages.length > 1 && (
                  <IconButton
                    className="nav-button prev animated-bounce ripple-btn"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev > 0 ? prev - 1 : productImages.length - 1
                      )
                    }
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.85)',
                      border: '2px solid #1976d2',
                      boxShadow: '0 2px 8px #90caf9',
                      zIndex: 2,
                      transition: 'background 0.2s',
                      '&:hover': { background: 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)', color: '#fff' }
                    }}
                  >
                    <ArrowBackIos />
                  </IconButton>
                )}
                {/* Ảnh sản phẩm */}
                <Box
                  className="main-image-anim"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={productImages[currentImageIndex] || "https://placehold.co/500x600?text=No+Image"}
                    alt={`Product ${currentImageIndex + 1}`}
                    className={`main-image animated-zoom animated-fade-img`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16,
                      boxShadow: '0 2px 8px 0 #e3f2fd',
                      transition: 'transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.5s',
                      opacity: 1,
                    }}
                    onLoad={e => e.target.classList.add('img-loaded')}
                    onError={e => e.target.classList.remove('img-loaded')}
                  />
                  {/* Loader khi ảnh chưa tải xong */}
                  <span className="img-loader"></span>
                </Box>
                {/* Nút điều hướng phải */}
                {productImages.length > 1 && (
                  <IconButton
                    className="nav-button next animated-bounce ripple-btn"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev < productImages.length - 1 ? prev + 1 : 0
                      )
                    }
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.85)',
                      border: '2px solid #1976d2',
                      boxShadow: '0 2px 8px #90caf9',
                      zIndex: 2,
                      transition: 'background 0.2s',
                      '&:hover': { background: 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)', color: '#fff' }
                    }}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                )}
                {/* Chấm tròn chuyển ảnh */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 18,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 2,
                  }}
                >
                  {productImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={idx === currentImageIndex ? 'dot active-dot pulse-dot' : 'dot'}
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: idx === currentImageIndex ? 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)' : '#ccc',
                        margin: '0 4px',
                        cursor: 'pointer',
                        border: '2px solid #fff',
                        transform: idx === currentImageIndex ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: idx === currentImageIndex ? '0 0 8px #1976d2' : 'none',
                        transition: 'all 0.3s',
                      }}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            {/* Thông tin sản phẩm */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minHeight: { md: 400 }, maxHeight: { md: 600 } }}>
              <Box className="product-info animated-slidein" sx={{ display: 'flex', flexDirection: 'column', gap: 3, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)', p: { xs: 2, md: 5 }, minHeight: 320, width: '100%', maxWidth: 500, minWidth: 320, ml: { xs: 0, md: 6 }, maxHeight: { md: 600 }, overflowY: { md: 'auto', xs: 'visible' } }}>
                {/* Header với tên sản phẩm và nút quản lý */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography
                    variant="h4"
                    className="product-name glow-on-hover"
                    sx={{
                      fontWeight: 900,
                      color: '#1976d2',
                      letterSpacing: 1,
                      textShadow: '0 2px 12px #e3f2fd',
                      lineHeight: 1.2,
                      fontSize: { xs: 22, sm: 28, md: 32 },
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      mb: 2,
                      maxWidth: { xs: '100%', md: 420 },
                      overflowWrap: 'break-word',
                      display: 'block',
                    }}
                  >
                    {product.product_name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/update-product/${id}`)}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: '#e3f2fd'
                        }
                      }}
                    >
                      Sửa SP
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Settings />}
                      onClick={() => navigate(`/update-variant/${id}`)}
                      sx={{
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: '#f57c00',
                          backgroundColor: '#fff3e0'
                        }
                      }}
                    >
                      Sửa Variants
                    </Button>
                  </Box>
                </Box>
                <Typography variant="h5" className="price info-block" sx={{ color: '#388e3c', fontWeight: 800, mb: 3, fontSize: 32, letterSpacing: 1 }}>
                  {currentPrice?.toLocaleString("vi-VN")} VND
                </Typography>
                <Box className="variant-section info-block" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" className="section-title" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>
                    Màu sắc
                  </Typography>
                  <Box className="color-options" sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    {availableColors.map((color) => (
                      <Button
                        key={color}
                        className={`variant-button ${selectedColor === color ? "selected" : ""}`}
                        onClick={() => setSelectedColor(color)}
                        sx={{
                          borderRadius: 8,
                          border: selectedColor === color ? '2.5px solid #1976d2' : '1.5px solid #ccc',
                          background: selectedColor === color ? 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)' : '#fff',
                          color: selectedColor === color ? '#fff' : '#1976d2',
                          fontWeight: 700,
                          fontSize: 16,
                          boxShadow: selectedColor === color ? '0 2px 8px #90caf9' : 'none',
                          transition: 'all 0.2s',
                          px: 3,
                          py: 1.2,
                          '&:hover': { background: 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)', color: '#fff' }
                        }}
                      >
                        {color}
                      </Button>
                    ))}
                  </Box>
                  <Typography variant="subtitle1" className="section-title" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>
                    Size
                  </Typography>
                  <Box className="size-options" sx={{ display: 'flex', gap: 2 }}>
                    {availableSizes.map((size) => (
                      <Button
                        key={size}
                        className={`variant-button ${selectedSize === size ? "selected" : ""}`}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          borderRadius: 8,
                          border: selectedSize === size ? '2.5px solid #1976d2' : '1.5px solid #ccc',
                          background: selectedSize === size ? 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)' : '#fff',
                          color: selectedSize === size ? '#fff' : '#1976d2',
                          fontWeight: 700,
                          fontSize: 16,
                          boxShadow: selectedSize === size ? '0 2px 8px #90caf9' : 'none',
                          transition: 'all 0.2s',
                          px: 3,
                          py: 1.2,
                          '&:hover': { background: 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)', color: '#fff' }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <Box className="quantity-section info-block" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" className="section-title" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>
                    Số lượng tồn kho của biến thể này
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 800, fontSize: 22 }}>
                    {variantStock}
                  </Typography>
                </Box>
                <Box className="description-section info-block" sx={{ mt: 1 }}>
                  <Typography variant="h6" className="section-title" sx={{ fontWeight: 800, mb: 2, fontSize: 20, color: '#1976d2' }}>
                    Mô tả sản phẩm
                  </Typography>
                  <Typography variant="body1" className="description" sx={{ whiteSpace: 'pre-line', fontSize: 17, color: '#333', background: '#f5fafd', borderRadius: 10, p: 2.5, boxShadow: '0 2px 8px #e3f2fd', fontWeight: 500 }}>
                    {product.product_description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      {/* CommentSection nằm dưới toàn bộ, chiếm full width, margin top rõ ràng */}
      <Box sx={{ width: '100%', mt: 5, display: 'flex', justifyContent: 'center' }}>
        <CommentSection productId={id} />
      </Box>
    </Container>
  );

  const loadingView = (
    <Box className="center-content">
      <CircularProgress />
    </Box>
  );

  const errorView = (
    <Box className="center-content">
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    </Box>
  );

  const noProductView = (
    <Box className="center-content">
      <Typography variant="h6">Không tìm thấy sản phẩm</Typography>
    </Box>
  );

// mainContent là phần nội dung chi tiết sản phẩm khi đã load xong
// loadingView là vòng quay chờ dữ liệu
// errorView hiển thị lỗi nếu có
// noProductView hiển thị nếu không có dữ liệu

// Trả về giao diện tổng của trang
return (
  <Box className="root-container">
    <TopBar /> {/* Thanh topbar cố định */}
    <Box className="main-content" style={{ background: '#f8fbff', minHeight: '100vh', paddingBottom: 40 }}>
      {loading
        ? loadingView
        : error
        ? errorView
        : !product
        ? noProductView
        : (
          <>
            {mainContent}
          </>
        )
      }
    </Box>
  </Box>
);

};

export default ProductDetail;
