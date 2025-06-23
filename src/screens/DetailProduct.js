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
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="product-images">
              <Box className="main-image-section">
                {productImages.length > 1 && (
                  <IconButton
                    className="nav-button prev"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev > 0 ? prev - 1 : productImages.length - 1
                      )
                    }
                  >
                    <ArrowBackIos />
                  </IconButton>
                )}

                <Box className="main-image-container">
                  <img
                    src={
                      productImages[currentImageIndex] ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={`Product ${currentImageIndex + 1}`}
                    className="main-image"
                  />
                </Box>

                {productImages.length > 1 && (
                  <IconButton
                    className="nav-button next"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev < productImages.length - 1 ? prev + 1 : 0
                      )
                    }
                  >
                    <ArrowForwardIos />
                  </IconButton>
                )}
              </Box>

              <Box className="thumbnail-container">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="product-info">
              <Typography variant="h1" className="product-name">
                {product.product_name}
              </Typography>

              <Box className="price-section">
                <Typography variant="h4" className="price">
                  {currentPrice?.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>

              <Box className="variant-section">
                <Typography variant="subtitle1" className="section-title">
                  Màu sắc
                </Typography>
                <Box className="color-options">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      className={`variant-button ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </Box>

                <Typography variant="subtitle1" className="section-title">
                  Size
                </Typography>
                <Box className="size-options">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      className={`variant-button ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Hiển thị số lượng tồn kho của biến thể hiện tại */}
              <Box className="quantity-section">
                <Typography variant="subtitle1" className="section-title">
                  Số lượng tồn kho của biến thể này
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {variantStock}
                </Typography>
              </Box>

              <Box className="description-section">
                <Typography variant="h6" className="section-title">
                  Mô tả sản phẩm
                </Typography>
                <Typography variant="body1" className="description">
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
