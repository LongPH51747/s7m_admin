import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../config/axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ImageIcon from '@mui/icons-material/Image';
import TopBar from "../components/TopBar";
import { ENDPOINTS, API_BASE } from "../config/api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_image: "",
    product_variant: [],
    product_category: [],
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [variantImageFiles, setVariantImageFiles] = useState([]); // reserved for future image edits in table
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axiosInstance.get(ENDPOINTS.GET_ALL_CATEGORIES);
        if (categoriesResponse.data) {
          const categoriesList = Array.isArray(categoriesResponse.data) 
            ? categoriesResponse.data 
            : categoriesResponse.data.categories || categoriesResponse.data.data || [];
          setCategories(categoriesList);
        }

        // Fetch product data
        const productResponse = await axiosInstance.get(ENDPOINTS.GET_PRODUCT_BY_ID(id));
        setProductData(productResponse.data);
        
        // Set initial preview for main image
        if (productResponse.data.product_image) {
          const imageUrl = productResponse.data.product_image.startsWith('/') 
            ? `${API_BASE}${productResponse.data.product_image}`
            : productResponse.data.product_image.startsWith('http')
            ? productResponse.data.product_image
            : `${API_BASE}${productResponse.data.product_image}`;
          setMainImagePreview(imageUrl);
        }
        
        // Set initial previews for variant images
        if (productResponse.data.product_variant) {
          const previews = productResponse.data.product_variant.map(variant => {
            if (variant.variant_image_url) {
              return variant.variant_image_url.startsWith('/') 
                ? `${API_BASE}${variant.variant_image_url}`
                : variant.variant_image_url.startsWith('http')
                ? variant.variant_image_url
                : `${API_BASE}${variant.variant_image_url}`;
            }
            return null;
          });
          setVariantImagePreviews(previews);
          setVariantImageFiles(new Array(productResponse.data.product_variant.length).fill(null));
        }
        
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Delete variant (API if existing, otherwise local only)
  const handleDeleteVariant = async (variant, index) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa biến thể này không?');
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (variant && variant._id) {
        await axiosInstance.delete(ENDPOINTS.DELETE_VARIANT_BY_ID(id, variant._id));
        console.log('🗑️ Đã xóa variant với ID:', variant._id);
        setSuccess(`Đã xóa biến thể thành công (ID: ${variant._id})`);
      }

      // Remove from local state
      setProductData((prev) => ({
        ...prev,
        product_variant: prev.product_variant.filter((_, i) => i !== index),
      }));
      setVariantImageFiles((prev) => prev.filter((_, i) => i !== index));
      setVariantImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('❌ Lỗi xóa variant:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Không thể xóa biến thể. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setProductData((prev) => ({
      ...prev,
      product_category: typeof value === 'string' ? [value] : value,
    }));
  };

  // Handle variant changes
  // Kept for future inline edits (currently unused after switching to table)
  // eslint-disable-next-line no-unused-vars
  const handleVariantChange = (..._args) => {};

  // Add new variant
  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      product_variant: [
        ...prev.product_variant,
        {
          variant_sku: "",
          variant_color: "",
          variant_size: "",
          variant_price: "",
          variant_quantity: "",
          variant_image_url: "",
          variant_stock: 0,
        },
      ],
    }));
    
    // Add empty slots for new variant
    setVariantImageFiles(prev => [...prev, null]);
    setVariantImagePreviews(prev => [...prev, null]);
  };

  // Remove variant
  // eslint-disable-next-line no-unused-vars
  const removeVariant = (..._args) => {};

  // Handle main image change
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle variant image change
  // eslint-disable-next-line no-unused-vars
  const handleVariantImageChange = (..._args) => {};

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!productData.product_name.trim()) {
        throw new Error('Vui lòng nhập tên sản phẩm!');
      }
      if (!productData.product_description.trim()) {
        throw new Error('Vui lòng nhập mô tả sản phẩm!');
      }
      if (!productData.product_category || productData.product_category.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một danh mục!');
      }

      // Prepare data for update
      const dataToSend = {
        product_name: productData.product_name.trim(),
        product_description: productData.product_description.trim(),
        product_price: parseFloat(productData.product_price) || 0,
        product_category: Array.isArray(productData.product_category) 
          ? productData.product_category 
          : [productData.product_category]
      };
      
      // Create FormData
      const formData = new FormData();
      formData.append('data_product', JSON.stringify(dataToSend));
      
      // Add main image if selected
      if (mainImageFile) {
        formData.append('product_image', mainImageFile);
      }

      const response = await axiosInstance.put(ENDPOINTS.UPDATE_PRODUCT_BY_ID(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Product updated successfully:', response.data);
      
      setSuccess("✅ Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      
    } catch (err) {
      console.error("❌ Product update error:", err.response?.data || err.message);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.";
      
      if (err.response?.status === 500) {
        errorMessage = "Lỗi server (500): " + (err.response?.data?.message || "Vui lòng kiểm tra dữ liệu và thử lại");
      } else if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ (400): " + (err.response?.data?.message || "Vui lòng kiểm tra thông tin nhập vào");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <TopBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Đang tải thông tin sản phẩm...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <TopBar />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        {/* Header Card */}
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                <EditIcon sx={{ mr: 2, fontSize: 40 }} />
                Cập nhật sản phẩm
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9 }}>
                {productData.product_name || 'Loading...'}
              </Typography>
              <Chip 
                label={`${productData.product_variant?.length || 0} variants`} 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Quay về trang chủ
            </Button>
          </Box>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Main Form Card */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Product Information Section */}
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Thông tin sản phẩm
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                {/* Product Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên sản phẩm *"
                    name="product_name"
                    value={productData.product_name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả *"
                    name="product_description"
                    value={productData.product_description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giá (VND) *"
                    name="product_price"
                    type="number"
                    value={productData.product_price}
                    onChange={handleInputChange}
                    required
                    inputProps={{ min: 0 }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Category - Full width for better display */}
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth required>
                    <InputLabel>Danh mục sản phẩm *</InputLabel>
                    <Select
                      value={productData.product_category?.[0] || ''}
                      onChange={handleCategoryChange}
                      label="Danh mục sản phẩm *"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          minHeight: 56
                        },
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '24px',
                          paddingTop: '16px',
                          paddingBottom: '16px',
                          paddingRight: '32px !important'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 450,
                            minWidth: 350,
                            maxWidth: 600,
                            '& .MuiMenuItem-root': {
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              minHeight: 64,
                              padding: '16px 20px',
                              lineHeight: 1.5,
                              alignItems: 'flex-start'
                            }
                          }
                        }
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            width: '100%',
                            minHeight: 48,
                            py: 1
                          }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                wordBreak: 'break-word',
                                lineHeight: 1.6,
                                whiteSpace: 'normal',
                                maxWidth: '100%',
                                fontSize: '0.95rem',
                                fontWeight: 500
                              }}
                            >
                              {cat.category_name || cat.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Product Image Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PhotoCameraIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Ảnh sản phẩm chính
                  </Typography>
                  
                  {/* Current Main Image Display */}
                  {mainImagePreview && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        📷 Ảnh hiện tại:
                      </Typography>
                      <CardMedia
                        component="img"
                        image={mainImagePreview}
                        alt="Current Product"
                        sx={{
                          width: 250,
                          height: 250,
                          borderRadius: 3,
                          border: '3px solid #e0e0e0',
                          objectFit: 'cover',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                  )}
                  
                  {/* File Input */}
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept="image/*"
                      type="file"
                      style={{ display: "none" }}
                      id="main-image-upload"
                      onChange={handleMainImageChange}
                    />
                    <label htmlFor="main-image-upload">
                      <Button 
                        variant="outlined" 
                        component="span" 
                        startIcon={<PhotoCameraIcon />}
                        sx={{ 
                          borderRadius: 2,
                          mb: 1
                        }}
                      >
                        Chọn ảnh mới
                      </Button>
                    </label>
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                        {mainImageFile ? `✅ File mới đã chọn: ${mainImageFile.name}` : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {!mainImageFile ? 'Chọn file mới để thay đổi ảnh hiện tại' : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Product Variants Section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 4 }}>
                    <Box
                      sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Biến thể sản phẩm
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addVariant}
                        variant="contained"
                        color="primary"
                        sx={{ 
                          borderRadius: 2,
                          px: 3
                        }}
                      >
                        Thêm biến thể
                      </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Màu sắc</TableCell>
                            <TableCell>Kích thước</TableCell>
                            <TableCell align="right">Giá (VND)</TableCell>
                            <TableCell align="right">Tồn kho</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                    {productData.product_variant.map((variant, index) => (
                            <TableRow key={variant._id || index} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {variantImagePreviews[index] ? (
                                  <img
                                    src={variantImagePreviews[index]}
                                    alt={`v-${index}`}
                                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                ) : (
                                  <Typography variant="caption" color="text.secondary">Không có</Typography>
                                )}
                              </TableCell>
                              <TableCell>{variant.variant_color || '-'}</TableCell>
                              <TableCell>{variant.variant_size || '-'}</TableCell>
                              <TableCell align="right">{Number(variant.variant_price || 0).toLocaleString('vi-VN')}</TableCell>
                              <TableCell align="right">{variant.variant_stock || variant.variant_quantity || 0}</TableCell>
                              <TableCell>{variant.variant_sku || '-'}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Xóa biến thể">
                                  <span>
                                    <IconButton color="error" onClick={() => handleDeleteVariant(variant, index)} disabled={loading}>
                              <DeleteIcon />
                            </IconButton>
                                  </span>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Paper elevation={1} sx={{ p: 4, backgroundColor: '#fafafa', borderRadius: 0 }}>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/home")}
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold'
                  }}
                >
                  ❌ Hủy
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate(`/update-variant/${id}`)}
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold'
                  }}
                >
                  🔧 Sửa Variants riêng
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    minWidth: 200,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={24} color="inherit" />
                      Đang cập nhật...
                    </Box>
                  ) : (
                    "✨ Cập nhật sản phẩm"
                  )}
                </Button>
              </Box>
            </Paper>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default UpdateProduct;
