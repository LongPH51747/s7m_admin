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
  // Select,
  // MenuItem,
  // FormControl,
  // InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../config/axios';
import { ENDPOINTS } from '../config/api';
import '../css/AddProduct.css';

// Hàm chuyển đổi URL thành Base64
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Giảm kích thước tối đa xuống
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Giảm chất lượng xuống 0.5 (50%) và lấy chỉ phần base64 data
        const base64String = canvas.toDataURL('image/jpeg', 0.5);
        const base64Data = base64String.split(',')[1]; // Lấy phần sau dấu phẩy
        resolve({
          base64: base64Data,
          type: 'image/jpeg'
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    throw error;
  }
};

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  // const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching categories...');
        const response = await axiosInstance.get(ENDPOINTS.GET_ALL_CATEGORIES, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.data) {
          const categoriesList = Array.isArray(response.data) ? response.data : response.data.categories;
          
          if (Array.isArray(categoriesList)) {
            console.log('Categories list:', categoriesList);
            setCategories(categoriesList);
          } else {
            console.error('Categories data is not an array:', categoriesList);
            setError('Định dạng dữ liệu danh mục không hợp lệ');
          }
        } else {
          console.error('No data in response');
          setError('Không nhận được dữ liệu từ server');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        let errorMessage = 'Không thể tải danh mục sản phẩm';
        
        if (error.response) {
          errorMessage += `: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage += ': Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        } else {
          errorMessage += `: ${error.message}`;
        }
        
        setError(errorMessage);
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
      console.log('Creating new category:', newCategory.trim());
      const response = await fetch(ENDPOINTS.CREATE_CATEGORY, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_name: newCategory.trim()
        })
      });

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse response as JSON
      let data;
      const textData = await response.text();
      try {
        data = JSON.parse(textData);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', textData);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Create category response:', data);

      if (data) {
        // Refresh categories list after adding new category
        const refreshResponse = await fetch(ENDPOINTS.GET_ALL_CATEGORIES, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!refreshResponse.ok) {
          throw new Error(`HTTP error! status: ${refreshResponse.status}`);
        }

        const refreshText = await refreshResponse.text();
        let refreshData;
        try {
          refreshData = JSON.parse(refreshText);
        } catch (parseError) {
          console.error('Failed to parse refresh response as JSON:', refreshText);
          throw new Error('Invalid JSON response from server during refresh');
        }

        const updatedCategories = Array.isArray(refreshData) ? 
          refreshData : refreshData.categories;

        if (Array.isArray(updatedCategories)) {
          setCategories(updatedCategories);
          // Find the newly created category and select it
          const newCat = updatedCategories.find(cat => cat.category_name === newCategory.trim());
          if (newCat) {
            setCategory(newCat._id || newCat.category_name);
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

    // Kiểm tra trùng lặp variant
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
      variant_image_url: '',
      variant_image_base64: '',
      variant_image_type: 'image/jpeg'
    };

    setVariants([...variants, newVariant]);
    setColor('');
    setSize('');
  };

  // Hàm xử lý xóa variant
  const handleDeleteVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // Hàm xử lý cập nhật thông tin variant
  const handleVariantChange = async (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'variant_image_url' && value) {
      try {
        const imageData = await urlToBase64(value);
        newVariants[index] = {
          ...newVariants[index],
          variant_image_base64: imageData.base64,
          variant_image_type: imageData.type,
          variant_image_url: value,
          [field]: value
        };
      } catch (error) {
        console.error('Error converting image URL:', error);
        alert('Không thể tải ảnh từ URL này. Vui lòng thử URL khác hoặc upload file ảnh.');
        return;
      }
    } else {
      // Xử lý các trường số
      if (field === 'variant_price' || field === 'variant_stock') {
        value = value.replace(/[^0-9]/g, ''); // Chỉ giữ lại số
        if (value === '') value = '0';
      }
      
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
    }
    setVariants(newVariants);
    
    // Log để debug
    console.log('Updated variant:', newVariants[index]);
  };

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (index, file) => {
    try {
      if (!file) return;
      
      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.onload = async () => {
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const base64String = canvas.toDataURL('image/jpeg', 0.5);
          const base64Data = base64String.split(',')[1];

          const newVariants = [...variants];
          newVariants[index] = {
            ...newVariants[index],
            variant_image_base64: base64Data,
            variant_image_type: 'image/jpeg',
            variant_image_url: base64String
          };
          setVariants(newVariants);
          
          // Log để debug
          console.log('Uploaded image for variant:', {
            index,
            hasBase64: !!base64Data,
            imageType: 'image/jpeg',
            previewUrl: base64String.substring(0, 50) + '...'
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại.');
    }
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (variants.length === 0) {
      alert('Vui lòng thêm ít nhất một variant!');
      return;
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!productName.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    if (!description.trim()) {
      alert('Vui lòng nhập mô tả sản phẩm!');
      return;
    }

    if (!category) {
      alert('Vui lòng chọn danh mục sản phẩm!');
      return;
    }

    // Kiểm tra variants
    for (const variant of variants) {
      if (!variant.variant_color || !variant.variant_size) {
        alert('Vui lòng nhập đầy đủ màu sắc và size cho tất cả các biến thể!');
        return;
      }
      if (!variant.variant_price || variant.variant_price <= 0) {
        alert('Vui lòng nhập giá hợp lệ cho tất cả các biến thể!');
        return;
      }
      if (!variant.variant_stock || variant.variant_stock < 0) {
        alert('Vui lòng nhập số lượng hợp lệ cho tất cả các biến thể!');
        return;
      }
    }

    // Lấy variant đầu tiên làm thông tin chính của sản phẩm
    const mainVariant = variants[0];

    // Chuẩn bị dữ liệu sản phẩm
    const productData = {
      product_name: productName.trim(),
      product_image: `data:${mainVariant.variant_image_type};base64,${mainVariant.variant_image_base64}` || '',
      product_price: parseFloat(mainVariant.variant_price) || 0,
      product_description: description.trim(),
      product_status: true,
      product_variant: variants.map(variant => ({
        variant_color: variant.variant_color.trim(),
        variant_size: variant.variant_size.trim(),
        variant_price: parseFloat(variant.variant_price) || 0,
        variant_stock: parseInt(variant.variant_stock) || 0,
        variant_image_base64: variant.variant_image_base64 && variant.variant_image_base64.includes('base64,') ? 
          variant.variant_image_base64.split('base64,')[1] : variant.variant_image_base64,
        variant_image_type: variant.variant_image_type || 'image/jpeg'
      })),
      product_category: [category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await axiosInstance.post(ENDPOINTS.CREATE_PRODUCT, productData);
      console.log('Server Response:', response.data);
      alert('Thêm sản phẩm thành công!');
      
      // Reset form
      setProductName('');
      setCategory('');
      setNewCategory('');
      setDescription('');
      setVariants([]);
      setColor('');
      setSize('');
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm!';
      
      if (error.response) {
        const responseData = error.response.data;
        errorMessage += `\nMã lỗi: ${error.response.status}`;
        errorMessage += `\nLỗi: ${responseData?.message || responseData || error.response.statusText}`;
        
        if (responseData?.errors) {
          console.log('Validation Errors:', responseData.errors);
          errorMessage += '\nChi tiết lỗi:';
          responseData.errors.forEach(err => {
            errorMessage += `\n- ${err.message || err}`;
          });
        }
      } else if (error.request) {
        errorMessage += '\nKhông thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      alert(errorMessage);
    }
  };

  // Render error message if there's an error
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
      <h1>Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Danh mục *</label>
          <div className="category-input-group">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.category_name} value={cat._id || cat.category_name}>
                      {cat.category_name}
                </option>
              ))}
            </select>
            <div className="new-category-input">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Thêm danh mục mới"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || loading}
                className="add-category-btn"
              >
                {loading ? 'Đang xử lý...' : 'Thêm mới'}
              </button>
            </div>
            {loading && <div className="loading-indicator">Đang tải...</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="variant-section">
          <Typography variant="h6" className="add-product-title">
            Thêm biến thể
          </Typography>
          <Box className="variant-inputs">
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
        </div>

        {variants.length > 0 && (
          <TableContainer component={Paper} className="variant-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Màu</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá (VND)</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Action</TableCell>
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
                        value={variant.variant_stock}
                        onChange={(e) => handleVariantChange(index, 'variant_stock', e.target.value)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={variant.variant_price}
                        onChange={(e) => handleVariantChange(index, 'variant_price', e.target.value)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="image-upload-section">
                        <TextField
                          size="small"
                          placeholder="URL hình ảnh"
                          value={variant.variant_image_url || ''}
                          onChange={(e) => handleVariantChange(index, 'variant_image_url', e.target.value)}
                        />
                        <input
                          accept="image/*"
                          type="file"
                          onChange={(e) => handleImageUpload(index, e.target.files[0])}
                          className="hidden-input"
                          id={`image-upload-${index}`}
                        />
                        <label htmlFor={`image-upload-${index}`}>
                          <Button variant="contained" component="span" size="small">
                            Upload
                          </Button>
                        </label>
                        {variant.variant_image_url && (
                          <img
                            src={variant.variant_image_url}
                            alt="Preview"
                            className="preview-image"
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={variants.length === 0}
        >
          Thêm sản phẩm
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;