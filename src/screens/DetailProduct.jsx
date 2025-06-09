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
  Rating,
  IconButton,
  Container,
} from "@mui/material";
// import { Select as AntSelect } from "antd";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import TabDraws from "../components/TabDraws";
import '../css/DetailProduct.css';

const formatImageData = (variant) => {
  console.log('Formatting image data for variant:', variant);

  // Nếu không có variant, trả về ảnh placeholder
  if (!variant) {
    console.log('No variant provided, returning placeholder');
    return 'https://placehold.co/600x400?text=No+Image';
  }

  // Ưu tiên sử dụng URL ảnh biến thể nếu có
  if (variant.variant_image_url) {
    console.log('Using variant_image_url:', variant.variant_image_url);
    return variant.variant_image_url;
  }

  // Nếu có ảnh base64
  if (variant.variant_image_base64) {
    console.log('Found base64 image data');
    
    // Nếu dữ liệu base64 đã là string
    if (typeof variant.variant_image_base64 === 'string') {
      console.log('Base64 is already a string');
      return `data:${variant.variant_image_type || 'image/jpeg'};base64,${variant.variant_image_base64}`;
    }
    
    // Nếu dữ liệu là Buffer hoặc có dạng {data: [...]}
    if (variant.variant_image_base64.data) {
      console.log('Converting Buffer data to base64');
      try {
        const bytes = new Uint8Array(variant.variant_image_base64.data);
        let binary = '';
        bytes.forEach((byte) => binary += String.fromCharCode(byte));
        const base64String = window.btoa(binary);
        return `data:${variant.variant_image_type || 'image/jpeg'};base64,${base64String}`;
      } catch (error) {
        console.error('Error converting image data:', error);
      }
    }
  }

  // Nếu có ảnh sản phẩm
  if (variant.product_image) {
    console.log('Using product_image:', variant.product_image);
    return variant.product_image;
  }

  // Trả về ảnh placeholder nếu không có ảnh nào
  console.log('No valid image found, returning placeholder');
  return 'https://placehold.co/600x400?text=No+Image';
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Sửa: Khởi tạo là null
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(""); // State mới cho ảnh
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State mới cho index ảnh hiện tại
  const [productImages, setProductImages] = useState([]); // State mới cho danh sách ảnh sản phẩm
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
// Effect chính để fetch dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/products/get-products-by-id/id/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        console.log('API Response:', response.data);

        const productData = response.data;
        const productVariants = productData.product_variant || [];

        console.log('Product Data:', productData);
        console.log('Product Variants:', productVariants);

        setProduct(productData);
        setVariants(productVariants);

        // Xử lý ảnh sản phẩm
        let images = [];
        
        // Thêm ảnh từ các biến thể
        if (productVariants.length > 0) {
          images = productVariants.map(variant => {
            // Ưu tiên sử dụng variant_image_url
            if (variant.variant_image_url) {
              console.log('Using variant_image_url:', variant.variant_image_url);
              return variant.variant_image_url;
            }
            const formattedImage = formatImageData(variant);
            console.log('Formatted variant image:', formattedImage);
            return formattedImage;
          });
        }
        
        // Thêm ảnh chính của sản phẩm nếu có
        if (productData.product_image) {
          images.unshift(productData.product_image);
          console.log('Added main product image:', productData.product_image);
        }
        
        // Lọc bỏ các ảnh trùng lặp
        images = [...new Set(images)];
        
        // Nếu không có ảnh nào, thêm ảnh placeholder
        if (images.length === 0) {
          images.push('https://placehold.co/600x400?text=No+Image');
        }

        console.log('Final image array:', images);
        setProductImages(images);

        // Xử lý biến thể đầu tiên
        if (productVariants.length > 0) {
          const firstVariant = productVariants[0];
          console.log('Setting initial variant:', firstVariant);
          setSelectedColor(firstVariant.variant_color);
          setSelectedSize(firstVariant.variant_size);
          setCurrentPrice(firstVariant.variant_price);
          // Ưu tiên sử dụng variant_image_url cho biến thể đầu tiên
          if (firstVariant.variant_image_url) {
            setCurrentImage(firstVariant.variant_image_url);
          } else {
            setCurrentImage(formatImageData(firstVariant));
          }
        } else {
          console.log('No variants, using main product data');
          setCurrentPrice(productData.product_price);
          setCurrentImage(productData.product_image || 'https://placehold.co/600x400?text=No+Image');
        }
        setCurrentImageIndex(0);

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
        console.log('Selected Variant:', selectedVariant);
        console.log('Variant Image URL:', selectedVariant.variant_image_url);
        
        setCurrentPrice(selectedVariant.variant_price);
        // Ưu tiên sử dụng variant_image_url
        if (selectedVariant.variant_image_url) {
          setCurrentImage(selectedVariant.variant_image_url);
        } else {
          setCurrentImage(formatImageData(selectedVariant));
        }
        
        // Cập nhật currentImageIndex nếu ảnh có trong danh sách
        const imageIndex = productImages.indexOf(selectedVariant.variant_image_url);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
        }
      }
    }
  }, [selectedColor, selectedSize, variants, productImages]);

  // Effect để cập nhật ảnh khi index thay đổi
  useEffect(() => {
    if (productImages.length > 0) {
      setCurrentImage(productImages[currentImageIndex]);
    }
  }, [currentImageIndex, productImages]);

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

  const mainContent = (
    <Container className="main-container">
      <Box className="title-section">
        <Typography variant="h4" component="h1" className="page-title">
          Chi tiết sản phẩm
        </Typography>
      </Box>

      {product && (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} className="product-grid">
          {/* Phần hình ảnh sản phẩm */}
          <Grid item xs={12} md={6}>
            <Box className="image-container">
              <img
                src={currentImage}
                alt={product?.product_name || 'Product Image'}
                className="product-image"
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <IconButton
                    className="arrow-button"
                    onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? productImages.length - 1 : prevIndex - 1))}
                  >
                    <ArrowBackIos />
                  </IconButton>
                  <IconButton
                    className="arrow-button"
                    onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === productImages.length - 1 ? 0 : prevIndex + 1))}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                  
                  {/* Dot Indicators */}
                  <Box className="dot-indicators">
                    {productImages.map((_, index) => (
                      <Box
                        key={index}
                        className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            <Box className="thumbnail-gallery">
              {productImages.map((image, index) => (
                <Box
                  key={index}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
          
          {/* Phần thông tin sản phẩm */}
          <Grid item xs={12} md={6}>
            <Box className="product-info">
              <Typography variant="h4" component="h1" className="product-name">
                {product.product_name}
              </Typography>
              
              <Box className="rating-container">
                <Rating name="product-rating" value={4} precision={0.5} readOnly />
                <Typography variant="body2" className="rating-text">
                  (150 Đánh giá)
                </Typography>
              </Box>
              
              <Typography
                variant="h5"
                className="price"
              >
                {currentPrice.toLocaleString('vi-VN')} VND
              </Typography>
              
              <Box className="color-container">
                <Typography variant="subtitle1" className="label">
                  Màu sắc
                </Typography>
                <Box className="color-options">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </Box>
              </Box>
              
              <Box className="size-container">
                <Typography variant="subtitle1" className="label">
                  Size
                </Typography>
                <Box className="size-options">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box className="quantity-container">
                <Typography variant="subtitle1" className="label">
                  Số lượng
                </Typography>
                <Box className="quantity-options">
                  <Button
                    className="quantity-button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </Button>
                  <TextField
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    inputProps={{
                      min: 1,
                      style: { textAlign: 'center', width: '50px' }
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    className="quantity-button"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </Box>
              </Box>

              <Button
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>

              <Box className="description-container">
                <Typography
                  variant="h6"
                  component="h2"
                  className="description-title"
                >
                  Mô tả sản phẩm
                </Typography>
                <Typography
                  className="description-text"
                >
                  {product.product_description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      
      {/* Phần đánh giá sản phẩm */}
      {product && (
        <Box className="review-container">
          <Typography variant="h5" className="review-title">
            Đánh giá sản phẩm
          </Typography>
          
          <Box className="summary-container">
            <Typography variant="h6" className="summary-title">4.0</Typography>
            <Rating name="review-summary-rating" value={4} precision={0.5} readOnly />
            <Typography className="summary-text">(150 Đánh giá)</Typography>
          </Box>

          <Box className="filter-container">
            {['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao'].map((filter) => (
              <Button
                key={filter}
                className="filter-button"
              >
                {filter}
              </Button>
            ))}
          </Box>

          {/* Review items */}
          <Box className="review-items">
            {[1, 2].map((review, index) => (
              <Box
                key={index}
                className="review-item"
              >
                <Box className="user-info">
                  <Box
                    className={`user-icon ${index === 0 ? 'db' : 'll'}`}
                  >
                    {index === 0 ? 'DB' : 'LL'}
                  </Box>
                </Box>
                
                <Box className="review-content">
                  <Typography className="user-name">
                    {index === 0 ? 'dinhbao08' : 'lelong113'}
                  </Typography>
                  <Rating name={`user-rating-${index}`} value={5} precision={0.5} readOnly size="small" />
                  <Typography className="review-date">
                    20-1-2023 | Màu Xanh | Size M
                  </Typography>
                  <Typography className="review-text">
                    Lần đầu tiên mua sản phẩm của shop mà ưng quá cả nhà ơi. Màu xanh navi mặc tone da cực kì luôn ạ. Mặc có vuông nhìn người gọn lắm nha. Đáng ủng hộ shop ạ
                  </Typography>
                  
                  <Box className="review-images">
                    {[1, 2, 3].map((img, imgIndex) => (
                      <Box
                        key={imgIndex}
                        className="review-image"
                      >
                        <Box
                          className="image-background"
                        >
                          Ảnh {imgIndex + 1}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
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
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  );

  const noProductView = (
    <Box className="center-content">
      <Typography variant="h6">Không tìm thấy sản phẩm</Typography>
    </Box>
  );

  return (
    <Box className="root-container">
      <TopBar className="top-bar" />
      
      <Box className="main-layout">
        <Box className="sidebar">
          <TabDraws />
        </Box>

        <Box className="content-area">
          {loading ? loadingView : 
           error ? errorView :
           !product ? noProductView :
           mainContent}
        </Box>
      </Box>

      <Footer className="footer" />
    </Box>
  );
};

export default ProductDetail;
