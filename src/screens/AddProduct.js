import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { ENDPOINTS } from '../config/api';
import '../css/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantImageFiles, setVariantImageFiles] = useState([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(ENDPOINTS.GET_ALL_CATEGORIES);
        if (response.data) {
          const categoriesList = Array.isArray(response.data) ? response.data : response.data.categories || response.data.data;
          if (Array.isArray(categoriesList)) {
            setCategories(categoriesList);
          } else {
            setError('Định dạng dữ liệu danh mục không hợp lệ');
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Không thể tải danh mục sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm thêm danh mục mới
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(ENDPOINTS.CREATE_CATEGORY, {
        category_name: newCategory.trim()
      });

      if (response.data) {
        // Refresh categories list
        const refreshResponse = await axiosInstance.get(ENDPOINTS.GET_ALL_CATEGORIES);
        const updatedCategories = Array.isArray(refreshResponse.data) ? 
          refreshResponse.data : refreshResponse.data.categories || refreshResponse.data.data;

        if (Array.isArray(updatedCategories)) {
          setCategories(updatedCategories);
          const newCat = updatedCategories.find(cat => cat.category_name === newCategory.trim());
          if (newCat) {
            setCategory(newCat._id);
          }
        }
        
        setNewCategory('');
        alert('Thêm danh mục thành công!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Có lỗi xảy ra khi thêm danh mục: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thêm variant
  const handleAddVariant = () => {
    if (!color || !size) {
      alert('Vui lòng nhập đầy đủ màu và size!');
      return;
    }

    const existingVariant = variants.find(
      v => v.variant_color.toLowerCase() === color.toLowerCase() && 
           v.variant_size.toLowerCase() === size.toLowerCase()
    );

    if (existingVariant) {
      alert('Biến thể này đã tồn tại!');
      return;
    }

    const newVariant = {
      variant_color: color,
      variant_size: size,
      variant_price: '',
      variant_stock: 0,
      variant_image_preview: ''
    };

    setVariants([...variants, newVariant]);
    setColor('');
    setSize('');
  };

  // Hàm xử lý xóa variant
  const handleDeleteVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    const newFiles = variantImageFiles.filter((_, i) => i !== index);
    setVariantImageFiles(newFiles);
  };

  // Hàm xử lý cập nhật thông tin variant
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'variant_price' || field === 'variant_stock') {
      value = value.replace(/[^0-9]/g, '');
      if (value === '') value = '0';
    }
    
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    setVariants(newVariants);
  };

  // Xử lý upload ảnh từ máy cho sản phẩm chính
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setMessage(`✅ Đã chọn ảnh: ${file.name}`);
    setMessageType("success");
    
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Xử lý upload ảnh cho từng variant
  const handleVariantImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newVariants = [...variants];
      newVariants[index].variant_image_preview = ev.target.result;
      setVariants(newVariants);
    };
    reader.readAsDataURL(file);
    
    const newFiles = [...variantImageFiles];
    newFiles[index] = file;
    setVariantImageFiles(newFiles);
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Validation
      if (!productName.trim()) {
        throw new Error('Vui lòng nhập tên sản phẩm!');
      }
      if (!description.trim()) {
        throw new Error('Vui lòng nhập mô tả sản phẩm!');
      }
      if (!category) {
        throw new Error('Vui lòng chọn danh mục sản phẩm!');
      }
      if (!imageFile) {
        throw new Error('Vui lòng chọn ảnh đại diện sản phẩm!');
      }
      if (variants.length === 0) {
        throw new Error('Vui lòng thêm ít nhất một variant!');
      }

      // Kiểm tra variants
      for (const variant of variants) {
        if (!variant.variant_color || !variant.variant_size) {
          throw new Error('Vui lòng nhập đầy đủ màu sắc và size cho tất cả các biến thể!');
        }
        if (!variant.variant_price || variant.variant_price <= 0) {
          throw new Error('Vui lòng nhập giá hợp lệ cho tất cả các biến thể!');
        }
        if (variant.variant_stock < 0) {
          throw new Error('Vui lòng nhập số lượng hợp lệ cho tất cả các biến thể!');
        }
      }

      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        product_name: productName.trim(),
        product_price: parseFloat(variants[0].variant_price) || 0,
        product_description: description.trim(),
        product_status: true,
        product_variant: variants.map((variant) => ({
          variant_color: variant.variant_color.trim(),
          variant_size: variant.variant_size.trim(),
          variant_price: parseFloat(variant.variant_price) || 0,
          variant_stock: parseInt(variant.variant_stock) || 0,
        })),
        product_category: [category],
      };

      // Tạo FormData
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      formData.append('product_image', imageFile);
      
      // Append variant images
      variantImageFiles.forEach((file, idx) => {
        if (file) {
          formData.append('product_variant', file);
        }
      });

      // Log FormData để debug
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? 'File object' : pair[1]);
      }

      // Gửi request
      const response = await axiosInstance.post(
        ENDPOINTS.CREATE_PRODUCT,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Xử lý phản hồi và log thông tin
      console.log('=== THÊM SẢN PHẨM THÀNH CÔNG ===');
      console.log('Full Response:', response.data);
      
      const productResult = response.data;
      
      // Log link ảnh đại diện
      if (productResult.product_image) {
        console.log('🖼️ Link ảnh đại diện:', productResult.product_image);
      }
      
      // Log link ảnh biến thể
      if (productResult.product_variant && Array.isArray(productResult.product_variant)) {
        productResult.product_variant.forEach((variant, idx) => {
          if (variant.variant_image_url) {
            console.log(`🎨 Link ảnh biến thể ${idx + 1} (${variant.variant_color} - ${variant.variant_size}):`, variant.variant_image_url);
          }
        });
      }
      
      // Log link sản phẩm
      if (productResult._id) {
        const productLink = `/products/${productResult._id}`;
        console.log('🔗 Link sản phẩm vừa thêm:', productLink);
        console.log('📱 Product ID:', productResult._id);
      }

      setMessage("✅ Thêm sản phẩm thành công!");
      setMessageType("success");
      
      // Reset form
      setProductName("");
      setCategory("");
      setNewCategory("");
      setDescription("");
      setVariants([]);
      setColor('');
      setSize('');
      setImagePreview("");
      setImageFile(null);
      setVariantImageFiles([]);
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      
    } catch (error) {
      console.error('=== LỖI KHI THÊM SẢN PHẨM ===');
      console.error('Error:', error);
      
      let errorMessage = "Thêm sản phẩm thất bại!";
      
      if (error.response?.status === 500) {
        errorMessage = "Lỗi server (500): " + (error.response?.data?.message || "Vui lòng kiểm tra dữ liệu và thử lại");
      } else if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ (400): " + (error.response?.data?.message || "Vui lòng kiểm tra thông tin nhập vào");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="error-message" style={{ color: 'red', padding: '20px' }}>
        <h3>Lỗi tải danh mục</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom>
          Thêm sản phẩm mới
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
      
      {message && (
        <Box 
          sx={{
            padding: 2,
            borderRadius: 1,
            marginBottom: 3,
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            border: messageType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            color: messageType === 'success' ? '#155724' : '#721c24'
          }}
        >
          {message}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Tên sản phẩm *"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </Box>

        {/* Danh mục */}
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Danh mục *</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.category_name || cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Thêm danh mục mới */}
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
            <TextField
              size="small"
              placeholder="Thêm danh mục mới"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outlined"
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || loading}
            >
              {loading ? 'Đang xử lý...' : 'Thêm mới'}
            </Button>
          </Box>
        </Box>

        {/* Mô tả */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Mô tả sản phẩm *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Box>

        {/* Ảnh sản phẩm */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ảnh đại diện sản phẩm *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="product-image-upload"
            />
            <label htmlFor="product-image-upload">
              <Button variant="contained" component="span">
                Chọn ảnh từ máy
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* Thêm biến thể */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thêm biến thể sản phẩm
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Màu sắc"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <TextField
              label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddVariant}>
              Thêm biến thể
            </Button>
          </Box>
        </Box>

        {/* Bảng biến thể */}
        {variants.length > 0 && (
          <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Màu</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Giá (VND)</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((variant, index) => (
                  <TableRow key={index}>
                    <TableCell>{variant.variant_color}</TableCell>
                    <TableCell>{variant.variant_size}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={variant.variant_price}
                        onChange={(e) => handleVariantChange(index, 'variant_price', e.target.value)}
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={variant.variant_stock}
                        onChange={(e) => handleVariantChange(index, 'variant_stock', e.target.value)}
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <input
                          accept="image/*"
                          type="file"
                          onChange={(e) => handleVariantImageUpload(e, index)}
                          style={{ display: 'none' }}
                          id={`variant-image-upload-${index}`}
                        />
                        <label htmlFor={`variant-image-upload-${index}`}>
                          <Button variant="outlined" component="span" size="small">
                            Upload ảnh
                          </Button>
                        </label>
                        {variant.variant_image_preview && (
                          <img
                            src={variant.variant_image_preview}
                            alt="Preview"
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteVariant(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Nút submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={variants.length === 0 || isSubmitting || !imageFile}
          sx={{ minWidth: 200 }}
        >
          {isSubmitting ? 'Đang thêm sản phẩm...' : 'Thêm sản phẩm'}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
