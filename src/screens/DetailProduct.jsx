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
} from "@mui/material";
import { Select as AntSelect } from "antd";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

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
        const response = await axios.get(`https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/products/get-products-by-id/id/${id}`, {
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
            width: '250px',  // Set fixed width
            height: '250px', // Set fixed height
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            margin: 'auto', // Center the box
          }}>
            <img
              src={currentImage}
              alt={product.product_name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '250px',  // Set fixed width
                height: '250px', // Set fixed height
                objectFit: 'contain', // Changed to contain to prevent image distortion
              }}
            />
            
            {/* Navigation Arrows - Adjusted positions */}
            {productImages.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    zIndex: 1, // Ensure arrows are above image
                  }}
                  onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? productImages.length - 1 : prevIndex - 1))}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    zIndex: 1, // Ensure arrows are above image
                  }}
                  onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === productImages.length - 1 ? 0 : prevIndex + 1))}
                >
                  <ArrowForwardIos />
                </IconButton>
                
                {/* Dot Indicators - Adjusted position */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  zIndex: 1, // Ensure dots are above image
                }}>
                  {productImages.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: currentImageIndex === index ? '#db4444' : 'rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.product_name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating name="product-rating" value={4} precision={0.5} readOnly /> {/* Giá trị cứng 4 sao, có thể thay đổi */} 
            <Typography variant="body2" sx={{ ml: 1 }}> (150 Reviews)</Typography>
          </Box>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {currentPrice.toLocaleString('vi-VN')}VND
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Màu sắc
            </Typography>
            <AntSelect
              value={selectedColor}
              onChange={(value) => setSelectedColor(value)}
              sx={{ width: 200 }}
            >
              {availableColors.map((color) => (
                <AntSelect.Option key={color} value={color}>
                  {color}
                </AntSelect.Option>
              ))}
            </AntSelect>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Size
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "contained" : "outlined"}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: '4px',
                    borderColor: selectedSize === size ? '#db4444' : '#ccc',
                    color: selectedSize === size ? '#fff' : '#333',
                    backgroundColor: selectedSize === size ? '#db4444' : 'transparent',
                    '&:hover': {
                      borderColor: selectedSize === size ? '#db4444' : '#999',
                      backgroundColor: selectedSize === size ? '#b83232' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
            Số lượng: {quantity}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</Button>
            <TextField
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              inputProps={{ min: 1, style: { textAlign: 'center' } }}
              sx={{ width: 60 }}
            />
            <Button onClick={() => setQuantity(prev => prev + 1)}>+</Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" sx={{ bgcolor: '#f0f0f0', p: 1, mb: 2, borderRadius: '4px' }}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {product.product_description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: '#db4444', '&:hover': { bgcolor: '#b83232' } }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Đánh giá sản phẩm</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">4 trên 5 sao</Typography>
          <Rating name="review-summary-rating" value={4} precision={0.5} readOnly sx={{ ml: 1 }} />
          <Typography variant="body2" sx={{ ml: 1 }}>(150 Reviews)</Typography>
        </Box>

        {/* Review filter buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          <Button variant="outlined">Tất cả</Button>
          <Button variant="outlined">5 sao</Button>
          <Button variant="outlined">4 sao</Button>
          <Button variant="outlined">3 sao</Button>
          <Button variant="outlined">2 sao</Button>
          <Button variant="outlined">1 sao</Button>
        </Box>

        {/* Individual reviews - Placeholder */}
        <Box sx={{ mt: 3 }}>
          {/* Review 1 */}
          <Box sx={{ display: 'flex', mb: 4 }}>
            <Box sx={{ mr: 2 }}>
              {/* Placeholder for Avatar */}
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#bdbdbd' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">dinhbao08</Typography>
              <Rating name="user-rating-1" value={5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">20-1-2023 | Màu Xanh | Size M</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>Lần đầu tiên mua sản phẩm của shop mà ưng quá cả nhà ơi. Màu xanh navi mặc tone da cực kì luôn ạ. Mặc có vuông nhìn người gọn lắm nha. Đáng ủng hộ shop ạ</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {/* Placeholder for review images */}
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
              </Box>
            </Box>
          </Box>

          {/* Review 2 */}
          <Box sx={{ display: 'flex', mb: 4 }}>
            <Box sx={{ mr: 2 }}>
              {/* Placeholder for Avatar */}
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#bdbdbd' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">lelong113</Typography>
              <Rating name="user-rating-2" value={5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">20-1-2023 | Màu Xanh | Size M</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>Lần đầu tiên mua sản phẩm của shop mà ưng quá cả nhà ơi. Màu xanh navi mặc tone da cực kì luôn ạ. Mặc có vuông nhìn người gọn lắm nha. Đáng ủng hộ shop ạ</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {/* Placeholder for review images */}
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
                <Box sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: '4px' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
