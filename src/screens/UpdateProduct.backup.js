import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
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
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
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
  const [variantImageFiles, setVariantImageFiles] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axiosInstance.get(
          ENDPOINTS.GET_ALL_CATEGORIES
        );
        if (categoriesResponse.data) {
          const categoriesList = Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : categoriesResponse.data.categories ||
              categoriesResponse.data.data ||
              [];
          setCategories(categoriesList);
        }

        // Fetch product data
        const productResponse = await axiosInstance.get(
          ENDPOINTS.GET_PRODUCT_BY_ID(id)
        );
        setProductData(productResponse.data);

        // Set initial preview for main image
        if (productResponse.data.product_image) {
          const imageUrl = productResponse.data.product_image.startsWith("/")
            ? `${API_BASE}${productResponse.data.product_image}`
            : productResponse.data.product_image.startsWith("http")
            ? productResponse.data.product_image
            : `${API_BASE}${productResponse.data.product_image}`;
          setMainImagePreview(imageUrl);
        }

        // Set initial previews for variant images
        if (productResponse.data.product_variant) {
          const previews = productResponse.data.product_variant.map(
            (variant) => {
              if (variant.variant_image_url) {
                return variant.variant_image_url.startsWith("/")
                  ? `${API_BASE}${variant.variant_image_url}`
                  : variant.variant_image_url.startsWith("http")
                  ? variant.variant_image_url
                  : `${API_BASE}${variant.variant_image_url}`;
              }
              return null;
            }
          );
          setVariantImagePreviews(previews);
          setVariantImageFiles(
            new Array(productResponse.data.product_variant.length).fill(null)
          );
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

  // Handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setProductData((prev) => ({
      ...prev,
      product_category: typeof value === "string" ? [value] : value,
    }));
  };

  // Handle variant changes
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
    setVariantImageFiles((prev) => [...prev, null]);
    setVariantImagePreviews((prev) => [...prev, null]);
  };

  // Remove variant
  const removeVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      product_variant: prev.product_variant.filter((_, i) => i !== index),
    }));

    // Remove corresponding files and previews
    setVariantImageFiles((prev) => prev.filter((_, i) => i !== index));
    setVariantImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!productData.product_name.trim()) {
        throw new Error("Vui lòng nhập tên sản phẩm!");
      }
      if (!productData.product_description.trim()) {
        throw new Error("Vui lòng nhập mô tả sản phẩm!");
      }
      if (
        !productData.product_category ||
        productData.product_category.length === 0
      ) {
        throw new Error("Vui lòng chọn ít nhất một danh mục!");
      }

      // Prepare data for update
      const dataToSend = {
        product_name: productData.product_name.trim(),
        product_description: productData.product_description.trim(),
        product_price: parseFloat(productData.product_price) || 0,
        product_category: Array.isArray(productData.product_category)
          ? productData.product_category
          : [productData.product_category],
      };

      // Create FormData
      const formData = new FormData();
      formData.append("data_product", JSON.stringify(dataToSend));

      // Add main image if selected
      if (mainImageFile) {
        formData.append("product_image", mainImageFile);
      }

      const response = await axiosInstance.put(
        ENDPOINTS.UPDATE_PRODUCT_BY_ID(id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Product updated successfully:", response.data);

      setSuccess("✅ Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (err) {
      console.error(
        "❌ Product update error:",
        err.response?.data || err.message
      );

      let errorMessage =
        "Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.";

      if (err.response?.status === 500) {
        errorMessage =
          "Lỗi server (500): " +
          (err.response?.data?.message ||
            "Vui lòng kiểm tra dữ liệu và thử lại");
      } else if (err.response?.status === 400) {
        errorMessage =
          "Dữ liệu không hợp lệ (400): " +
          (err.response?.data?.message ||
            "Vui lòng kiểm tra thông tin nhập vào");
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
      <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <TopBar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
              Đang tải thông tin sản phẩm...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <TopBar />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        {/* Header Card */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                <EditIcon sx={{ mr: 2, fontSize: 40 }} />
                Cập nhật sản phẩm
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9 }}>
                {productData.product_name || "Loading..."}
              </Typography>
              <Chip
                label={`${productData.product_variant?.length || 0} variants`}
                sx={{
                  mt: 2,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate("/home")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                fontWeight: "bold",
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
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
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Product Information Section */}
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, display: "flex", alignItems: "center" }}
                  >
                    <EditIcon sx={{ mr: 1, color: "primary.main" }} />
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Category - Full width for better display */}
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth required>
                    <InputLabel>Danh mục sản phẩm *</InputLabel>
                    <Select
                      value={productData.product_category?.[0] || ""}
                      onChange={handleCategoryChange}
                      label="Danh mục sản phẩm *"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          minHeight: 56,
                        },
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          minHeight: "24px",
                          paddingTop: "16px",
                          paddingBottom: "16px",
                          paddingRight: "32px !important",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 450,
                            minWidth: 350,
                            maxWidth: 600,
                            "& .MuiMenuItem-root": {
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              minHeight: 64,
                              padding: "16px 20px",
                              lineHeight: 1.5,
                              alignItems: "flex-start",
                            },
                          },
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              width: "100%",
                              minHeight: 48,
                              py: 1,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                wordBreak: "break-word",
                                lineHeight: 1.6,
                                whiteSpace: "normal",
                                maxWidth: "100%",
                                fontSize: "0.95rem",
                                fontWeight: 500,
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
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <PhotoCameraIcon sx={{ mr: 1, color: "primary.main" }} />
                    Ảnh sản phẩm chính
                  </Typography>

                  {/* Current Main Image Display */}
                  {mainImagePreview && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
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
                          border: "3px solid #e0e0e0",
                          objectFit: "cover",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
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
                          mb: 1,
                        }}
                      >
                        Chọn ảnh mới
                      </Button>
                    </label>

                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        color="success.main"
                        sx={{ display: "block" }}
                      >
                        {mainImageFile
                          ? `✅ File mới đã chọn: ${mainImageFile.name}`
                          : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {!mainImageFile
                          ? "Chọn file mới để thay đổi ảnh hiện tại"
                          : ""}
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
                      <Typography
                        variant="h5"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <ImageIcon sx={{ mr: 1, color: "primary.main" }} />
                        Biến thể sản phẩm
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addVariant}
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          px: 3,
                        }}
                      >
                        Thêm biến thể
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {productData.product_variant.map((variant, index) => (
                      <Card
                        key={index}
                        elevation={4}
                        sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}
                      >
                        {/* Variant Header */}
                        <Box
                          sx={{
                            p: 3,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography variant="h5" fontWeight="bold">
                                Biến thể #{index + 1}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                sx={{ opacity: 0.9, mt: 0.5 }}
                              >
                                {variant.variant_color && variant.variant_size
                                  ? `${variant.variant_color} - ${variant.variant_size}`
                                  : "Chưa có thông tin"}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => removeVariant(index)}
                              sx={{
                                color: "white",
                                backgroundColor: "rgba(255,255,255,0.2)",
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.3)",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <CardContent sx={{ p: 4 }}>
                          <Grid container spacing={4}>
                            {/* Left Column - Image Section */}
                            <Grid item xs={12} lg={5}>
                              <Paper
                                elevation={2}
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  backgroundColor: "#f8f9fa",
                                  height: "fit-content",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    mb: 3,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <PhotoCameraIcon
                                    sx={{ mr: 1, color: "primary.main" }}
                                  />
                                  Ảnh biến thể
                                </Typography>

                                {/* Current variant image */}
                                {variantImagePreviews[index] && (
                                  <Box sx={{ mb: 3, textAlign: "center" }}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                      sx={{ mb: 2 }}
                                    >
                                      📷 Ảnh hiện tại:
                                    </Typography>
                                    <CardMedia
                                      component="img"
                                      image={variantImagePreviews[index]}
                                      alt={`Variant ${index + 1}`}
                                      sx={{
                                        width: "100%",
                                        maxWidth: 200,
                                        height: 200,
                                        borderRadius: 3,
                                        border: "3px solid #e0e0e0",
                                        objectFit: "cover",
                                        boxShadow:
                                          "0 8px 24px rgba(0,0,0,0.15)",
                                        transition: "all 0.3s ease",
                                        margin: "0 auto",
                                        "&:hover": {
                                          transform: "scale(1.05)",
                                          boxShadow:
                                            "0 12px 32px rgba(0,0,0,0.2)",
                                        },
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </Box>
                                )}

                                {/* File Upload */}
                                <Box sx={{ textAlign: "center" }}>
                                  <input
                                    accept="image/*"
                                    type="file"
                                    style={{ display: "none" }}
                                    id={`variant-image-${index}`}
                                    onChange={(e) =>
                                      handleVariantImageChange(index, e)
                                    }
                                  />
                                  <label htmlFor={`variant-image-${index}`}>
                                    <Button
                                      variant="contained"
                                      component="span"
                                      startIcon={<PhotoCameraIcon />}
                                      sx={{
                                        borderRadius: 3,
                                        px: 3,
                                        py: 1.5,
                                        background:
                                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        "&:hover": {
                                          background:
                                            "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                        },
                                      }}
                                    >
                                      Chọn ảnh mới
                                    </Button>
                                  </label>

                                  <Box sx={{ mt: 2 }}>
                                    <Typography
                                      variant="caption"
                                      color="success.main"
                                      sx={{ display: "block" }}
                                    >
                                      {variantImageFiles[index]
                                        ? `✅ File mới: ${variantImageFiles[index].name}`
                                        : ""}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {!variantImageFiles[index]
                                        ? "Chọn file để thay đổi ảnh"
                                        : ""}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>

                            {/* Right Column - Form Fields */}
                            <Grid item xs={12} lg={7}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      mb: 2,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <EditIcon
                                      sx={{ mr: 1, color: "primary.main" }}
                                    />
                                    Thông tin biến thể
                                  </Typography>
                                  <Divider sx={{ mb: 3 }} />
                                </Grid>

                                {/* Row 1: SKU and Color */}
                                <Grid item xs={12} md={6}>
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
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Màu sắc *"
                                    value={variant.variant_color || ""}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "variant_color",
                                        e.target.value
                                      )
                                    }
                                    required
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>

                                {/* Row 2: Size and Price */}
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Kích thước *"
                                    value={variant.variant_size || ""}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "variant_size",
                                        e.target.value
                                      )
                                    }
                                    required
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Giá biến thể (VND) *"
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
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>

                                {/* Row 3: Stock */}
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Số lượng tồn kho *"
                                    type="number"
                                    value={
                                      variant.variant_stock ||
                                      variant.variant_quantity ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "variant_stock",
                                        e.target.value
                                      )
                                    }
                                    required
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>

                                {/* Empty space for better layout balance */}
                                <Grid item xs={12} md={6}>
                                  {/* This creates balanced spacing */}
                                </Grid>

                                {/* Enhanced Variant Summary */}
                                <Grid item xs={12}>
                                  <Paper
                                    elevation={3}
                                    sx={{
                                      p: 3,
                                      mt: 2,
                                      background:
                                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                                      borderRadius: 3,
                                      border: "2px solid #dee2e6",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                      sx={{ mb: 2 }}
                                    >
                                      📊 Tóm tắt biến thể
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Chip
                                        avatar={
                                          <Avatar
                                            sx={{
                                              bgcolor: "#4caf50",
                                              fontSize: 14,
                                            }}
                                          >
                                            💰
                                          </Avatar>
                                        }
                                        label={`${Number(
                                          variant.variant_price || 0
                                        )?.toLocaleString("vi-VN")} VND`}
                                        variant="filled"
                                        sx={{
                                          backgroundColor: "#e8f5e8",
                                          color: "#2e7d32",
                                          fontWeight: "bold",
                                        }}
                                      />
                                      <Chip
                                        avatar={
                                          <Avatar
                                            sx={{
                                              bgcolor: "#2196f3",
                                              fontSize: 14,
                                            }}
                                          >
                                            📦
                                          </Avatar>
                                        }
                                        label={`${
                                          variant.variant_stock ||
                                          variant.variant_quantity ||
                                          0
                                        } sản phẩm`}
                                        variant="filled"
                                        sx={{
                                          backgroundColor: "#e3f2fd",
                                          color: "#1976d2",
                                          fontWeight: "bold",
                                        }}
                                      />
                                      {variant.variant_sku && (
                                        <Chip
                                          avatar={
                                            <Avatar
                                              sx={{
                                                bgcolor: "#ff9800",
                                                fontSize: 14,
                                              }}
                                            >
                                              🏷️
                                            </Avatar>
                                          }
                                          label={variant.variant_sku}
                                          variant="filled"
                                          sx={{
                                            backgroundColor: "#fff3e0",
                                            color: "#f57c00",
                                            fontWeight: "bold",
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Paper>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Paper
              elevation={1}
              sx={{ p: 4, backgroundColor: "#fafafa", borderRadius: 0 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/home")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
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
                    fontWeight: "bold",
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
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
