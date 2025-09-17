// --- START OF FILE UpdateProduct.js ---

import React, { useState, useEffect, useCallback } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
import TopBar from "../components/TopBar";
import { ENDPOINTS, API_BASE } from "../config/api";
// ... các import khác giữ nguyên ...

const UpdateProductNew = () => {
  // ... tất cả các state và hook ban đầu của bạn giữ nguyên ...
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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

  // ... useEffect để fetch data cũng giữ nguyên ...
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const productResponse = await axiosInstance.get(
          ENDPOINTS.GET_PRODUCT_BY_ID(id)
        );
        setProductData(productResponse.data);

        if (productResponse.data.product_image) {
          const imageUrl = productResponse.data.product_image.startsWith("/")
            ? `${API_BASE}${productResponse.data.product_image}`
            : productResponse.data.product_image.startsWith("http")
            ? productResponse.data.product_image
            : `${API_BASE}${productResponse.data.product_image}`;
          setMainImagePreview(imageUrl);
        }

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
  }, [id, refreshTrigger]);

  // ... các hàm handler nhỏ (handleInputChange, handleDeleteVariant, etc.) cũng giữ nguyên ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteVariant = async (variant, index) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa biến thể này không?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (variant && variant._id) {
        await axiosInstance.delete(
          ENDPOINTS.DELETE_VARIANT_BY_ID(id, variant._id)
        );
        console.log("🗑️ Đã xóa variant với ID:", variant._id);
        setSuccess(`Đã xóa biến thể thành công (ID: ${variant._id})`);
      }

      setProductData((prev) => ({
        ...prev,
        product_variant: prev.product_variant.filter((_, i) => i !== index),
      }));
      setVariantImageFiles((prev) => prev.filter((_, i) => i !== index));
      setVariantImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("❌ Lỗi xóa variant:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Không thể xóa biến thể. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setProductData((prev) => ({
      ...prev,
      product_category: typeof value === "string" ? [value] : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductData((prev) => {
      const updatedVariants = [...(prev.product_variant || [])];

      if (field === "variant_price" || field === "variant_stock") {
        const digitsOnly = (value || "").toString().replace(/[^0-9]/g, "");
        const normalized = digitsOnly.replace(/^0+(?=\d)/, "");
        value = normalized;
      }

      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };

      return {
        ...prev,
        product_variant: updatedVariants,
      };
    });
  };

  const addVariant = useCallback(() => {
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

    setVariantImageFiles((prev) => [...prev, null]);
    setVariantImagePreviews((prev) => [...prev, null]);
  }, []);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setVariantImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    const reader = new FileReader();
    reader.onload = (ev) => {
      setVariantImagePreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = ev.target.result;
        return newPreviews;
      });
    };
    reader.readAsDataURL(file);
  };

  // ====================================================================
  // HÀM SUBMIT DUY NHẤT MỚI - KẾT HỢP LOGIC CỦA 3 NÚT CŨ
  // ====================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- BƯỚC 1: VALIDATION TOÀN BỘ DỮ LIỆU ---
      if (!productData.product_name.trim())
        throw new Error("Vui lòng nhập tên sản phẩm!");
      if (!productData.product_description.trim())
        throw new Error("Vui lòng nhập mô tả sản phẩm!");
      if (
        !productData.product_category ||
        productData.product_category.length === 0
      )
        throw new Error("Vui lòng chọn ít nhất một danh mục!");

      for (const variant of productData.product_variant) {
        if (!variant.variant_color || !variant.variant_size)
          throw new Error(
            "Vui lòng nhập đầy đủ màu sắc và size cho tất cả các biến thể!"
          );
        if (!variant.variant_price || Number(variant.variant_price) <= 0)
          throw new Error("Vui lòng nhập giá hợp lệ cho tất cả các biến thể!");
      }

      // --- BƯỚC 2: CẬP NHẬT THÔNG TIN SẢN PHẨM CHÍNH (LOGIC NÚT "Cập nhật sản phẩm") ---
      console.log("🔄 Bước 1/3: Bắt đầu cập nhật thông tin sản phẩm chính...");
      const mainProductData = {
        product_name: productData.product_name.trim(),
        product_description: productData.product_description.trim(),
        product_price: parseFloat(productData.product_price) || 0,
        product_category: Array.isArray(productData.product_category)
          ? productData.product_category
          : [productData.product_category],
      };

      const mainFormData = new FormData();
      mainFormData.append("data_product", JSON.stringify(mainProductData));
      if (mainImageFile) {
        mainFormData.append("product_image", mainImageFile);
      }

      await axiosInstance.put(
        ENDPOINTS.UPDATE_PRODUCT_BY_ID(id),
        mainFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("✅ Bước 1/3: Cập nhật thông tin sản phẩm chính thành công!");

      // --- BƯỚC 3: CẬP NHẬT CÁC BIẾN THỂ ĐÃ CÓ (LOGIC NÚT "Cập nhật variants") ---
      const variantsToUpdate = productData.product_variant.filter((v) => v._id);
      if (variantsToUpdate.length > 0) {
        console.log(
          `🔄 Bước 2/3: Bắt đầu cập nhật ${variantsToUpdate.length} biến thể đã có...`
        );
        const variantDataToUpdate = variantsToUpdate.map((variant) => ({
          _id: variant._id,
          variant_sku: variant.variant_sku || "",
          variant_image_url: variant.variant_image_url || "",
          variant_color: variant.variant_color || "",
          variant_size: variant.variant_size || "",
          variant_price: Number(variant.variant_price) || 0,
          variant_stock:
            Number(variant.variant_stock || variant.variant_quantity) || 0,
        }));

        const updateVariantsFormData = new FormData();
        updateVariantsFormData.append(
          "variant_data",
          JSON.stringify(variantDataToUpdate)
        );
        // Lưu ý: Logic gửi ảnh cho variant cũ không được xử lý trong code gốc, nên giữ nguyên.

        await axiosInstance.put(
          ENDPOINTS.UPDATE_VARIANT_BY_PRODUCT_ID(id),
          updateVariantsFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("✅ Bước 2/3: Cập nhật biến thể đã có thành công!");
      } else {
        console.log("ℹ️ Bước 2/3: Không có biến thể nào cần cập nhật.");
      }

      // --- BƯỚC 4: THÊM CÁC BIẾN THỂ MỚI (LOGIC NÚT "Lưu variant mới") ---
      // Lặp qua toàn bộ mảng variant để lấy đúng index của file ảnh
      const addVariantPromises = productData.product_variant
        .map((variant, index) => {
          if (!variant._id) {
            // Chỉ xử lý các variant chưa được lưu
            console.log(
              `🔄 Bước 3/3: Chuẩn bị thêm biến thể mới tại index ${index}...`
            );
            const newVariantData = {
              product_variant: [
                {
                  variant_sku: variant.variant_sku || "",
                  variant_image_url: variant.variant_image_url || "",
                  variant_color: variant.variant_color || "",
                  variant_size: variant.variant_size || "",
                  variant_price: Number(variant.variant_price) || 0,
                  variant_stock:
                    Number(variant.variant_stock || variant.variant_quantity) ||
                    0,
                },
              ],
            };

            const addVariantFormData = new FormData();
            addVariantFormData.append("data", JSON.stringify(newVariantData));
            const imageFile = variantImageFiles[index];
            if (imageFile) {
              addVariantFormData.append("product_variant_image", imageFile);
            }

            return axiosInstance.post(
              ENDPOINTS.ADD_PRODUCT_VARIANT(id),
              addVariantFormData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          }
          return null; // Trả về null cho các variant đã có
        })
        .filter(Boolean); // Lọc bỏ các giá trị null

      if (addVariantPromises.length > 0) {
        await Promise.all(addVariantPromises);
        console.log(
          `✅ Bước 3/3: Thêm ${addVariantPromises.length} biến thể mới thành công!`
        );
      } else {
        console.log("ℹ️ Bước 3/3: Không có biến thể mới nào cần thêm.");
      }

      // --- BƯỚC 5: HOÀN TẤT ---
      alert("✅ Cập nhật sản phẩm và tất cả các biến thể thành công!")
    //   setSuccess("✅ Cập nhật sản phẩm và tất cả các biến thể thành công!");
      window.location.reload()
    //   setTimeout(() => {
    //     navigate("/home");
    //   }, 2000);
    } catch (err) {
      console.error(
        "❌ Lỗi trong quá trình cập nhật tổng thể:",
        err.response?.data || err.message
      );
      let errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";
      setError(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // ... màn hình loading giữ nguyên ...
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

  // ===============================================================
  // THAY ĐỔI TRONG PHẦN RENDER UI
  // ===============================================================
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

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Gán hàm handleSubmit mới cho sự kiện onSubmit của form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* ... Toàn bộ Grid Items cho thông tin sản phẩm và bảng biến thể giữ nguyên ... */}
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <EditIcon sx={{ mr: 1, color: "primary.main" }} />
                    Thông tin sản phẩm
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                {/* Compact product info table */}
                <Grid item xs={12}>
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table
                      size="small"
                      sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1.5 } }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ width: 220 }}>
                            Tên sản phẩm *
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              name="product_name"
                              value={productData.product_name}
                              onChange={handleInputChange}
                              required
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mô tả *</TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              name="product_description"
                              value={productData.product_description}
                              onChange={handleInputChange}
                              multiline
                              rows={3}
                              required
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Giá (VND) *</TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              name="product_price"
                              type="number"
                              value={productData.product_price}
                              onChange={handleInputChange}
                              inputProps={{ min: 0 }}
                              required
                              variant="outlined"
                              size="small"
                              sx={{ maxWidth: 280 }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Danh mục sản phẩm *</TableCell>
                          <TableCell>
                            <FormControl fullWidth required size="small">
                              <InputLabel size="small">
                                Danh mục sản phẩm *
                              </InputLabel>
                              <Select
                                value={productData.product_category?.[0] || ""}
                                onChange={handleCategoryChange}
                                label="Danh mục sản phẩm *"
                              >
                                {categories.map((cat) => (
                                  <MenuItem key={cat._id} value={cat._id}>
                                    {cat.category_name || cat.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Ảnh sản phẩm chính</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                  size="small"
                                >
                                  Chọn ảnh
                                </Button>
                              </label>
                              {mainImagePreview && (
                                <img
                                  src={mainImagePreview}
                                  alt="main"
                                  style={{
                                    width: 48,
                                    height: 48,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #eee",
                                    marginLeft: 8,
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {mainImageFile
                                ? `✅ File mới đã chọn: ${mainImageFile.name}`
                                : ""}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {/* Phần Biến thể sản phẩm */}
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
                      {/* Nút "Thêm biến thể" vẫn giữ lại để thêm dòng vào bảng ở local */}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addVariant}
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        Thêm dòng biến thể
                      </Button>
                    </Box>
                    {/* ... TableContainer và Table giữ nguyên ... */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table
                        size="small"
                        sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1 } }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Màu sắc</TableCell>
                            <TableCell>Kích thước</TableCell>
                            <TableCell align="right">Giá (VND)</TableCell>
                            <TableCell align="right">Tồn kho</TableCell>
                            <TableCell>Mã biến thể</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productData.product_variant.map((variant, index) => (
                            <TableRow key={variant._id || index} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Chip
                                  label={variant._id ? "Đã lưu" : "Chưa lưu"}
                                  color={variant._id ? "success" : "warning"}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
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
                                    variant="outlined"
                                    component="span"
                                    size="small"
                                  >
                                    Chọn ảnh
                                  </Button>
                                </label>
                                {variantImagePreviews[index] && (
                                  <img
                                    src={variantImagePreviews[index]}
                                    alt={`v-${index}`}
                                    style={{
                                      width: 36,
                                      height: 36,
                                      objectFit: "cover",
                                      borderRadius: 6,
                                      border: "1px solid #eee",
                                      marginLeft: 8,
                                      verticalAlign: "middle",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={variant.variant_color || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variant_color",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Màu"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={variant.variant_size || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variant_size",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Size"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={variant.variant_price || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variant_price",
                                      e.target.value
                                    )
                                  }
                                  inputProps={{ min: 0 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={
                                    variant.variant_stock ||
                                    variant.variant_quantity ||
                                    0
                                  }
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variant_stock",
                                      e.target.value
                                    )
                                  }
                                  inputProps={{ min: 0 }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={variant.variant_sku || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variant_sku",
                                      e.target.value
                                    )
                                  }
                                  placeholder="SKU"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Xóa biến thể">
                                  <span>
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleDeleteVariant(variant, index)
                                      }
                                      disabled={loading}
                                    >
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

            {/* Action Buttons: Chỉ giữ lại nút Hủy và nút Submit chính */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                backgroundColor: "#fafafa",
                borderRadius: 0,
                position: "sticky",
                bottom: 0,
                zIndex: 100,
                borderTop: "1px solid #eee",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate("/home")}
                  sx={{ borderRadius: 3, px: 3, py: 1, fontWeight: "bold" }}
                >
                  ❌ Hủy
                </Button>

                {/* NÚT SUBMIT DUY NHẤT */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  disabled={loading}
                  sx={{
                    minWidth: 200,
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    /* ... các sx props khác ... */
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CircularProgress size={24} color="inherit" />
                      Đang xử lý...
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

export default UpdateProductNew;
