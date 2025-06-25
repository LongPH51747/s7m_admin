import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(ENDPOINTS.GET_PRODUCT_BY_ID(id), {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setProductData(response.data);
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
        },
      ],
    }));
  };

  // Xóa biến thể
  const removeVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      product_variant: prev.product_variant.filter((_, i) => i !== index),
    }));
  };

  // Xử lý chọn file ảnh chính
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData((prev) => ({ ...prev, product_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý chọn file ảnh biến thể
  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        // Lấy phần base64 (sau dấu phẩy)
        const base64 = dataUrl.split(",")[1];
        setProductData((prev) => {
          const updatedVariants = [...prev.product_variant];
          updatedVariants[index] = {
            ...updatedVariants[index],
            variant_image_url: dataUrl,
            variant_image_base64: base64,
          };
          return { ...prev, product_variant: updatedVariants };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Khi load lại dữ liệu, nếu có base64 mà không có url, tự tạo url cho preview
  useEffect(() => {
    setProductData((prev) => {
      const updatedVariants = (prev.product_variant || []).map((variant) => {
        if (
          variant.variant_image_base64 &&
          (!variant.variant_image_url || variant.variant_image_url === "")
        ) {
          return {
            ...variant,
            variant_image_url: `data:image/jpeg;base64,${variant.variant_image_base64}`,
          };
        }
        return variant;
      });
      return { ...prev, product_variant: updatedVariants };
    });
  }, [loading]);

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(ENDPOINTS.UPDATE_PRODUCT_BY_ID(id), productData, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      setSuccess("Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
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
          <Typography variant="h4" gutterBottom>
            Cập nhật sản phẩm
          </Typography>

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
                  {productData.product_image &&
                    typeof productData.product_image === "string" &&
                    productData.product_image.trim() !== "" && (
                      <img
                        src={productData.product_image}
                        alt="Preview"
                        style={{
                          maxWidth: 120,
                          maxHeight: 120,
                          borderRadius: 8,
                          border: "1px solid #eee",
                        }}
                      />
                    )}
                  <TextField
                    fullWidth
                    label="URL Hình ảnh (hoặc chọn file)"
                    name="product_image"
                    value={productData.product_image}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  />
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
                          value={variant.variant_quantity || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variant_quantity",
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
                          {(() => {
                            // Ưu tiên variant_image_url
                            if (
                              variant.variant_image_url &&
                              typeof variant.variant_image_url === "string" &&
                              variant.variant_image_url.trim() !== ""
                            ) {
                              return (
                                <img
                                  src={variant.variant_image_url}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 8,
                                    border: "1px solid #eee",
                                  }}
                                />
                              );
                            }
                            // Nếu có variant_image_base64
                            if (variant.variant_image_base64) {
                              let src = "";
                              if (
                                typeof variant.variant_image_base64 === "string"
                              ) {
                                src = variant.variant_image_base64.startsWith(
                                  "data:"
                                )
                                  ? variant.variant_image_base64
                                  : `data:image/jpeg;base64,${variant.variant_image_base64}`;
                              } else if (variant.variant_image_base64.data) {
                                // Nếu là buffer
                                const bytes = new Uint8Array(
                                  variant.variant_image_base64.data
                                );
                                let binary = "";
                                bytes.forEach(
                                  (byte) =>
                                    (binary += String.fromCharCode(byte))
                                );
                                const base64String = window.btoa(binary);
                                src = `data:image/jpeg;base64,${base64String}`;
                              }
                              if (
                                src &&
                                typeof src === "string" &&
                                src.trim() !== ""
                              ) {
                                return (
                                  <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                      maxWidth: 100,
                                      maxHeight: 100,
                                      borderRadius: 8,
                                      border: "1px solid #eee",
                                    }}
                                  />
                                );
                              }
                            }
                            // Nếu có variant_image
                            if (
                              variant.variant_image &&
                              typeof variant.variant_image === "string" &&
                              variant.variant_image.trim() !== ""
                            ) {
                              return (
                                <img
                                  src={variant.variant_image}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 8,
                                    border: "1px solid #eee",
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                          <TextField
                            fullWidth
                            label="URL Hình ảnh biến thể (hoặc chọn file)"
                            value={variant.variant_image_url || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "variant_image_url",
                                e.target.value
                              )
                            }
                            sx={{ mt: 1 }}
                          />
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
