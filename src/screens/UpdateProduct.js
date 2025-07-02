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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TopBar from "../components/TopBar";
import { ENDPOINTS } from "../config/api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productData, setProductData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_image: "",
    product_variant: [],
  });
  
  // State for file uploads
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [variantImageFiles, setVariantImageFiles] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(ENDPOINTS.GET_PRODUCT_BY_ID(id));
        setProductData(response.data);
        
        // Set initial preview for main image
        if (response.data.product_image) {
          const imageUrl = response.data.product_image.startsWith('/') 
            ? `http://192.168.1.7:3000${response.data.product_image}`
            : response.data.product_image;
          setMainImagePreview(imageUrl);
        }
        
        // Set initial previews for variant images
        if (response.data.product_variant) {
          const previews = response.data.product_variant.map(variant => {
            if (variant.variant_image_url) {
              return variant.variant_image_url.startsWith('/') 
                ? `http://192.168.1.7:3000${variant.variant_image_url}`
                : variant.variant_image_url;
            }
            return null;
          });
          setVariantImagePreviews(previews);
          setVariantImageFiles(new Array(response.data.product_variant.length).fill(null));
        }
        
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Xử lý thay đổi input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi biến thể
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...productData.product_variant];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setProductData((prev) => ({
      ...prev,
      product_variant: updatedVariants,
    }));
  };

  // Thêm biến thể mới
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

  // Xóa biến thể
  const removeVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      product_variant: prev.product_variant.filter((_, i) => i !== index),
    }));
    
    // Remove corresponding files and previews
    setVariantImageFiles(prev => prev.filter((_, i) => i !== index));
    setVariantImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Xử lý chọn file ảnh chính
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

  // Xử lý chọn file ảnh biến thể
  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Update file array
      const newFiles = [...variantImageFiles];
      newFiles[index] = file;
      setVariantImageFiles(newFiles);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...variantImagePreviews];
        newPreviews[index] = reader.result;
        setVariantImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };



  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation trước khi gửi
      if (!productData.product_name.trim()) {
        throw new Error('Vui lòng nhập tên sản phẩm!');
      }
      if (!productData.product_description.trim()) {
        throw new Error('Vui lòng nhập mô tả sản phẩm!');
      }

      // Tạo FormData cho multipart/form-data upload
      const formData = new FormData();
      
      // Chuẩn bị data object (loại bỏ các field ảnh)
      const dataToSend = {
        product_name: productData.product_name.trim(),
        product_description: productData.product_description.trim(),
        product_price: parseFloat(productData.product_price) || 0,
        product_status: productData.product_status !== false, // ensure boolean
        product_variant: productData.product_variant.map(variant => ({
          variant_sku: variant.variant_sku || "",
          variant_color: variant.variant_color || "",
          variant_size: variant.variant_size || "",
          variant_price: parseFloat(variant.variant_price) || 0,
          variant_stock: parseInt(variant.variant_stock || variant.variant_quantity || 0),
          _id: variant._id
        })),
        product_category: Array.isArray(productData.product_category) ? productData.product_category : []
      };
      
      formData.append('data', JSON.stringify(dataToSend));
      
      // Append main image file if selected
      if (mainImageFile) {
        formData.append('product_image', mainImageFile);
      }
      
      // Append variant image files if selected
      variantImageFiles.forEach((file, idx) => {
        if (file) {
          formData.append('product_variant', file);
        }
      });

      // Log FormData để debug
      console.log('=== UPDATE PRODUCT FormData ===');
      console.log('Product Data:', JSON.stringify(dataToSend, null, 2));
      console.log('Main Image File:', mainImageFile ? mainImageFile.name : 'No new image');
      console.log('Variant Image Files:', variantImageFiles.map((file, idx) => file ? `${idx}: ${file.name}` : `${idx}: No file`));
      
      // Validate data trước khi gửi
      if (!dataToSend.product_name) {
        throw new Error('Tên sản phẩm không được để trống');
      }
      if (!dataToSend.product_description) {
        throw new Error('Mô tả sản phẩm không được để trống');
      }
      if (dataToSend.product_variant.length === 0) {
        throw new Error('Phải có ít nhất một biến thể');
      }
      
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? `File: ${pair[1].name}` : pair[1]);
      }

      const response = await axiosInstance.put(ENDPOINTS.UPDATE_PRODUCT_BY_ID(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Log thông tin response
      console.log('=== UPDATE PRODUCT THÀNH CÔNG ===');
      console.log('Response:', response.data);
      
      setSuccess("✅ Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (err) {
      console.error("=== LỖI KHI UPDATE PRODUCT ===");
      console.error("Error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TopBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <Typography variant="h4" gutterBottom>
              Cập nhật sản phẩm
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/home')}
              sx={{
                padding: '8px 20px',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              Quay về trang chủ
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="product_name"
                  value={productData.product_name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="product_description"
                  value={productData.product_description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giá"
                  name="product_price"
                  type="number"
                  value={productData.product_price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Ảnh sản phẩm
                  </Typography>
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: "block", marginBottom: 8 }}
                    onChange={handleMainImageChange}
                  />
                  {mainImagePreview && (
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: 120,
                        maxHeight: 120,
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.log('Error loading image:', mainImagePreview);
                      }}
                    />
                  )}
                  <Typography variant="caption" color="textSecondary">
                    {mainImageFile ? `Đã chọn: ${mainImageFile.name}` : 'Chưa chọn file mới'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Biến thể sản phẩm</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addVariant}
                    variant="contained"
                    color="primary"
                  >
                    Thêm biến thể
                  </Button>
                </Box>

                {productData.product_variant.map((variant, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle1">
                            Biến thể #{index + 1}
                          </Typography>
                          <IconButton
                            onClick={() => removeVariant(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="SKU"
                          value={variant.variant_sku || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_sku",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Màu sắc"
                          value={variant.variant_color || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_color",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Kích thước"
                          value={variant.variant_size || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_size",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Giá biến thể"
                          type="number"
                          value={variant.variant_price || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_price",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Số lượng"
                          type="number"
                          value={variant.variant_stock || variant.variant_quantity || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_stock",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Ảnh biến thể
                          </Typography>
                          <input
                            accept="image/*"
                            type="file"
                            style={{ display: "block", marginBottom: 8 }}
                            onChange={(e) => handleVariantImageChange(index, e)}
                          />
                          {variantImagePreviews[index] && (
                            <img
                              src={variantImagePreviews[index]}
                              alt={`Preview ${index + 1}`}
                              style={{
                                maxWidth: 100,
                                maxHeight: 100,
                                borderRadius: 8,
                                border: "1px solid #eee",
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                console.log('Error loading variant image:', variantImagePreviews[index]);
                              }}
                            />
                          )}
                          <Typography variant="caption" color="textSecondary">
                            {variantImageFiles[index] ? `Đã chọn: ${variantImageFiles[index].name}` : 'Chưa chọn file'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/products")}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Cập nhật sản phẩm"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default UpdateProduct;
