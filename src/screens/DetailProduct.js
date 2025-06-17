import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  Container,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import "../css/DetailProduct.css";
import { ENDPOINTS } from "../config/api";

const formatImageData = (variant) => {
  console.log("Formatting image data for variant:", variant);

  // Nếu không có variant, trả về ảnh placeholder
  if (!variant) {
    console.log("No variant provided, returning placeholder");
    return "https://placehold.co/600x400?text=No+Image";
  }

  // Ưu tiên sử dụng URL ảnh biến thể nếu có
  if (variant.variant_image_url) {
    console.log("Using variant_image_url:", variant.variant_image_url);
    return variant.variant_image_url;
  }

  // Nếu có ảnh base64
  if (variant.variant_image_base64) {
    console.log("Found base64 image data");

    // Nếu dữ liệu base64 đã là string
    if (typeof variant.variant_image_base64 === "string") {
      console.log("Base64 is already a string");
      // Nếu đã có prefix data: thì giữ nguyên, nếu không thì thêm vào
      if (variant.variant_image_base64.startsWith("data:")) {
        return variant.variant_image_base64;
      }
      return `data:${variant.variant_image_type || "image/jpeg"};base64,${variant.variant_image_base64}`;
    }

    // Nếu dữ liệu là Buffer hoặc có dạng {data: [...]}
    if (variant.variant_image_base64.data) {
      console.log("Converting Buffer data to base64");
      try {
        const bytes = new Uint8Array(variant.variant_image_base64.data);
        let binary = "";
        bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
        const base64String = window.btoa(binary);
        return `data:${
          variant.variant_image_type || "image/jpeg"
        };base64,${base64String}`;
      } catch (error) {
        console.error("Error converting image data:", error);
      }
    }
  }

  // Nếu có ảnh sản phẩm
  if (variant.product_image) {
    console.log("Using product_image:", variant.product_image);
    return variant.product_image;
  }

  // Trả về ảnh placeholder nếu không có ảnh nào
  console.log("No valid image found, returning placeholder");
  return "https://placehold.co/600x400?text=No+Image";
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Effect chính để fetch dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          ENDPOINTS.GET_PRODUCT_BY_ID(id),
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("API Response:", response.data);

        const productData = response.data;
        const productVariants = productData.product_variant || [];

        console.log("Product Data:", productData);
        console.log("Product Variants:", productVariants);

        setProduct(productData);
        setVariants(productVariants);

        // Xử lý ảnh sản phẩm
        let images = [];

        // Thêm ảnh từ các biến thể
        if (productVariants.length > 0) {
          images = productVariants.map((variant) => {
            // Ưu tiên sử dụng variant_image_url
            if (variant.variant_image_url) {
              console.log(
                "Using variant_image_url:",
                variant.variant_image_url
              );
              return variant.variant_image_url;
            }
            const formattedImage = formatImageData(variant);
            console.log("Formatted variant image:", formattedImage);
            return formattedImage;
          });
        }

        // Thêm ảnh chính của sản phẩm nếu có
        if (productData.product_image) {
          images.unshift(productData.product_image);
          console.log("Added main product image:", productData.product_image);
        }

        // Lọc bỏ các ảnh trùng lặp
        images = [...new Set(images)];

        // Nếu không có ảnh nào, thêm ảnh placeholder
        if (images.length === 0) {
          images.push("https://placehold.co/600x400?text=No+Image");
        }

        console.log("Final image array:", images);
        setProductImages(images);

        // Xử lý biến thể đầu tiên
        if (productVariants.length > 0) {
          const firstVariant = productVariants[0];
          console.log("Setting initial variant:", firstVariant);
          setSelectedColor(firstVariant.variant_color);
          setSelectedSize(firstVariant.variant_size);
          setCurrentPrice(firstVariant.variant_price);
          // Ưu tiên sử dụng variant_image_url cho biến thể đầu tiên
          if (firstVariant.variant_image_url) {
            setCurrentImageIndex(0);
          } else {
            setCurrentImageIndex(0);
          }
        } else {
          console.log("No variants, using main product data");
          setCurrentPrice(productData.product_price);
          setCurrentImageIndex(0);
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
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
        .filter((v) => v.variant_color === selectedColor)
        .map((v) => v.variant_size);

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
        (v) =>
          v.variant_color === selectedColor && v.variant_size === selectedSize
      );
      if (selectedVariant) {
        console.log("Selected Variant:", selectedVariant);
        console.log("Variant Image URL:", selectedVariant.variant_image_url);

        setCurrentPrice(selectedVariant.variant_price);
        // Ưu tiên sử dụng variant_image_url
        if (selectedVariant.variant_image_url) {
          setCurrentImageIndex(
            productImages.indexOf(selectedVariant.variant_image_url)
          );
        }
      }
    }
  }, [selectedColor, selectedSize, variants, productImages]);

  // Effect để cập nhật ảnh khi index thay đổi
  useEffect(() => {
    if (productImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [productImages]);

  // Dùng useMemo để tính toán các màu và size có sẵn, tránh re-render không cần thiết
  const availableColors = useMemo(
    () => [...new Set(variants.map((v) => v.variant_color))],
    [variants]
  );

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

  const handleAddToCart = () => {
    const selectedVariant = variants.find(
      (v) =>
        v.variant_color === selectedColor && v.variant_size === selectedSize
    );
    console.log({
      productId: product._id, // Schema dùng _id
      variantSku: selectedVariant ? selectedVariant.variant_sku : null,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: currentPrice,
    });
    // Thêm logic gọi API ở đây
  };

  const mainContent = (
    <Container className="main-container">
      {product && (
        <Grid container spacing={4}>
          {/* Cột hình ảnh sản phẩm */}
          <Grid item xs={12} md={6}>
            <Box className="product-images">
              {/* Ảnh chính với nút điều hướng ở hai bên */}
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

              {/* Container cho thumbnails */}
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

          {/* Right side - Product Info */}
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

              <Box className="quantity-section">
                <Typography variant="subtitle1" className="section-title">
                  Số lượng
                </Typography>
                <Box className="quantity-selector">
                  <IconButton
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) {
                        setQuantity(val);
                      }
                    }}
                    inputProps={{
                      style: {
                        textAlign: "center",
                        width: "50px",
                        padding: "8px",
                      },
                    }}
                  />
                  <IconButton onClick={() => setQuantity((prev) => prev + 1)}>
                    +
                  </IconButton>
                </Box>
              </Box>

              <Button
                variant="contained"
                className="add-to-cart"
                onClick={handleAddToCart}
                fullWidth
              >
                THÊM VÀO GIỎ HÀNG
              </Button>

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

  return (
    <Box className="root-container">
      <TopBar />
      <Box className="main-content">
        {loading
          ? loadingView
          : error
          ? errorView
          : !product
          ? noProductView
          : mainContent}
      </Box>
      <Footer />
    </Box>
  );
};

export default ProductDetail;
