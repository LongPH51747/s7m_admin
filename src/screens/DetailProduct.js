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
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"; // Icon điều hướng hình ảnh
import TopBar from "../components/TopBar"; // Thanh topbar của trang
import "../css/DetailProduct.css"; // CSS riêng cho trang này
import { ENDPOINTS, API_BASE } from "../config/api"; // Các URL API định nghĩa sẵn


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
  // Lấy ID từ URL
  const { id } = useParams();

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
    <Container className="main-container">
      {product && (
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Ảnh sản phẩm - 50% bên trái */}
          <Grid item xs={12} md={6}>
            <Box
              className="product-image-box animated-fadein"
              sx={{
                width: { xs: '90vw', md: 500 },
                height: { xs: 350, md: 600 },
                border: '3px solid #2196f3',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
                boxShadow: '0 8px 32px 0 rgba(33,150,243,0.15)',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: '0 16px 48px 0 rgba(33,150,243,0.25)' }
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
                    border: '2px solid #2196f3',
                    boxShadow: '0 2px 8px #90caf9',
                    zIndex: 2,
                    transition: 'background 0.2s',
                    '&:hover': { background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }
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
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    borderRadius: 12,
                    boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
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
                    border: '2px solid #2196f3',
                    boxShadow: '0 2px 8px #90caf9',
                    zIndex: 2,
                    transition: 'background 0.2s',
                    '&:hover': { background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }
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
                      background: idx === currentImageIndex ? 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)' : '#ccc',
                      margin: '0 4px',
                      cursor: 'pointer',
                      border: '2px solid #fff',
                      transform: idx === currentImageIndex ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: idx === currentImageIndex ? '0 0 8px #2196f3' : 'none',
                      transition: 'all 0.3s',
                    }}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Thông tin sản phẩm - 50% bên phải */}
          <Grid item xs={12} md={6}>
            <Box className="product-info animated-slidein" style={{ display: 'flex', flexDirection: 'column', gap: 20, background: 'rgba(255,255,255,0.95)', borderRadius: 12, boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)', padding: 32 }}>
              <Typography variant="h4" className="product-name glow-on-hover" style={{ fontWeight: 700, color: '#1976d2', letterSpacing: 1, marginBottom: 8, textShadow: '0 2px 8px #e3f2fd' }}>
                {product.product_name}
              </Typography>
              <Typography variant="h5" className="price info-block" style={{ color: '#388e3c', fontWeight: 600, marginBottom: 12 }}>
                {currentPrice?.toLocaleString("vi-VN")} VND
              </Typography>
              <Box className="variant-section info-block" style={{ marginBottom: 12 }}>
                <Typography variant="subtitle1" className="section-title" style={{ fontWeight: 600 }}>
                  Màu sắc
                </Typography>
                <Box className="color-options" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      className={`variant-button ${selectedColor === color ? "selected" : ""}`}
                      onClick={() => setSelectedColor(color)}
                      sx={{
                        borderRadius: 6,
                        border: selectedColor === color ? '2px solid #1976d2' : '1px solid #ccc',
                        background: selectedColor === color ? 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)' : '#fff',
                        color: selectedColor === color ? '#fff' : '#1976d2',
                        fontWeight: 600,
                        boxShadow: selectedColor === color ? '0 2px 8px #90caf9' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': { background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </Box>
                <Typography variant="subtitle1" className="section-title" style={{ fontWeight: 600 }}>
                  Size
                </Typography>
                <Box className="size-options" style={{ display: 'flex', gap: 8 }}>
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      className={`variant-button ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        borderRadius: 6,
                        border: selectedSize === size ? '2px solid #1976d2' : '1px solid #ccc',
                        background: selectedSize === size ? 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)' : '#fff',
                        color: selectedSize === size ? '#fff' : '#1976d2',
                        fontWeight: 600,
                        boxShadow: selectedSize === size ? '0 2px 8px #90caf9' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': { background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box className="quantity-section info-block" style={{ marginBottom: 12 }}>
                <Typography variant="subtitle1" className="section-title" style={{ fontWeight: 600 }}>
                  Số lượng tồn kho của biến thể này
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
                  {variantStock}
                </Typography>
              </Box>
              <Box className="description-section info-block">
                <Typography variant="h6" className="section-title" style={{ fontWeight: 700, marginBottom: 6 }}>
                  Mô tả sản phẩm
                </Typography>
                <Typography variant="body1" className="description" style={{ whiteSpace: 'pre-line', fontSize: 16, color: '#333', background: '#f5fafd', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #e3f2fd' }}>
                  {product.product_description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
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
    <Box className="main-content">
      {loading
        ? loadingView
        : error
        ? errorView
        : !product
        ? noProductView
        : mainContent}
    </Box>
  </Box>
);

};

export default ProductDetail;
