import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import axios from 'axios';
import { ENDPOINTS, API_BASE } from '../config/api';
import TopBar from "../components/TopBar";

const UpdateVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [variants, setVariants] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [variantImageFiles, setVariantImageFiles] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Fetch product variants
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(ENDPOINTS.GET_PRODUCT_BY_ID(id), {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        if (response.data && response.status === 200) {
          const { _id, product_name, product_variant = [] } = response.data;
          
          setProductInfo({ _id, product_name });
          setVariants(product_variant);
          
          // Setup image previews for existing variants
          const previews = product_variant.map(variant => {
            if (variant.variant_image_url) {
              return variant.variant_image_url.startsWith('/') 
                ? `${API_BASE}${variant.variant_image_url}`
                : variant.variant_image_url;
            }
            return null;
          });
          
          setVariantImagePreviews(previews);
          setVariantImageFiles(new Array(product_variant.length).fill(null));
        } else {
          setError("Không có dữ liệu sản phẩm");
        }
        
      } catch (err) {
        console.error("❌ Error fetching variants:", err.message);
        setError("Không thể tải thông tin variants: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVariants();
    } else {
      setError("Không có ID sản phẩm");
      setLoading(false);
    }
  }, [id]);

  // Handle variant field changes
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    
    // Convert price and stock to numbers
    if (field === 'variant_price' || field === 'variant_stock') {
      value = value.replace(/[^0-9]/g, '');
      if (value === '') value = '0';
    }
    
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  // Handle image file changes
  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update file array
    const newFiles = [...variantImageFiles];
    newFiles[index] = file;
    setVariantImageFiles(newFiles);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newPreviews = [...variantImagePreviews];
      newPreviews[index] = ev.target.result;
      setVariantImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // Update all variants
  const handleUpdateAllVariants = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (variants.length === 0) {
        throw new Error('Không có variants nào để cập nhật!');
      }

      // Validate required fields
      for (const variant of variants) {
        if (!variant.variant_color || !variant.variant_size) {
          throw new Error('Vui lòng nhập đầy đủ màu sắc và size cho tất cả variants!');
        }
        if (!variant.variant_price || variant.variant_price <= 0) {
          throw new Error('Vui lòng nhập giá hợp lệ cho tất cả variants!');
        }
      }

      // Format data for API
      const variantData = variants.map(variant => ({
        variant_sku: variant.variant_sku || "",
        variant_image_url: variant.variant_image_url || "",
        variant_color: variant.variant_color || "",
        variant_size: variant.variant_size || "",
        variant_price: Number(variant.variant_price) || 0,
        variant_stock: Number(variant.variant_stock) || 0,
        _id: variant._id
      }));

      // Create FormData
      const formData = new FormData();
      formData.append('variant_data', JSON.stringify(variantData));
      
      // Add image files
      variantImageFiles.forEach((file) => {
        if (file) {
          formData.append('files', file);
        }
      });

      // Send update request
      const response = await axios.put(ENDPOINTS.UPDATE_VARIANT_BY_PRODUCT_ID(id), formData, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      console.log('✅ Update successful:', response.data);
      setSuccess('✅ Cập nhật tất cả variants thành công!');
      
      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật variants.";
      if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ: " + (err.response.data?.message || "Vui lòng kiểm tra thông tin nhập vào");
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi server: " + (err.response.data?.message || "Vui lòng thử lại sau");
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải thông tin variants...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <TopBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Cập nhật Variants - {productInfo.product_name || 'Loading...'}
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

          {/* Alerts */}
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

          <Typography variant="h6" sx={{ mb: 3 }}>
            Danh sách Variants ({variants.length} variants)
          </Typography>

          {/* Variants List */}
          {variants.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Không có variants nào được tìm thấy cho sản phẩm này.
            </Alert>
          ) : (
            variants.map((variant, index) => (
              <Card key={variant._id || index} sx={{ mb: 3 }} variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary">
                        Variant #{index + 1} - {variant.variant_color} ({variant.variant_size})
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {variant._id}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="SKU"
                        value={variant.variant_sku || ""}
                        onChange={(e) => handleVariantChange(index, "variant_sku", e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Màu sắc *"
                        value={variant.variant_color || ""}
                        onChange={(e) => handleVariantChange(index, "variant_color", e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Kích thước *"
                        value={variant.variant_size || ""}
                        onChange={(e) => handleVariantChange(index, "variant_size", e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Giá (VND) *"
                        type="number"
                        value={variant.variant_price || ""}
                        onChange={(e) => handleVariantChange(index, "variant_price", e.target.value)}
                        required
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số lượng *"
                        type="number"
                        value={variant.variant_stock || ""}
                        onChange={(e) => handleVariantChange(index, "variant_stock", e.target.value)}
                        required
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Ảnh variant
                        </Typography>
                        <input
                          accept="image/*"
                          type="file"
                          style={{ display: "none" }}
                          id={`variant-image-${index}`}
                          onChange={(e) => handleVariantImageChange(index, e)}
                        />
                        <label htmlFor={`variant-image-${index}`}>
                          <Button variant="contained" component="span" sx={{ mb: 1 }}>
                            Chọn ảnh từ máy
                          </Button>
                        </label>
                        
                        {variantImagePreviews[index] && (
                          <img
                            src={variantImagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            style={{
                              maxWidth: 120,
                              maxHeight: 120,
                              borderRadius: 8,
                              border: "1px solid #eee",
                              display: 'block',
                              marginTop: 8
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                          {variantImageFiles[index] ? `Đã chọn: ${variantImageFiles[index].name}` : 'Chưa chọn file mới'}
                        </Typography>
                        {variant.variant_image_url && (
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            Ảnh hiện tại: {variant.variant_image_url.split('/').pop()}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", alignItems: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                          Stock: {variant.variant_stock} | Price: {Number(variant.variant_price)?.toLocaleString("vi-VN")} VND
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/update-product/${id}`)}
            >
              Quay lại sửa sản phẩm
            </Button>
            {variants.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpdateAllVariants}
                disabled={loading}
                sx={{ 
                  minWidth: 200,
                  backgroundColor: '#2e7d32',
                  '&:hover': { backgroundColor: '#1b5e20' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Cập nhật Tất cả Variants"}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UpdateVariant;