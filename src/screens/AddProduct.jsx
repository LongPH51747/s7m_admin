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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
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
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Thêm useEffect để lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://059f-2405-4802-4b2-2810-c455-f308-457-aa78.ngrok-free.app/api/categories/get-all-categories',
          {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
        console.log('Categories response:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response || error);
      }
    };

    fetchCategories();
  }, []);

  // Sửa lại hàm xử lý thêm danh mục mới
  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      // Kiểm tra xem danh mục đã tồn tại chưa
      const existingCategory = categories.find(
        cat => cat.category_name.toLowerCase() === newCategory.toLowerCase()
      );

      if (existingCategory) {
        // Nếu danh mục đã tồn tại, sử dụng danh mục đó
        setCategory(existingCategory._id);
        setNewCategory('');
        alert('Danh mục này đã tồn tại. Đã chọn danh mục có sẵn.');
        return;
      }

      // Nếu danh mục chưa tồn tại, tạo mới
      const response = await axios.post(
        'https://059f-2405-4802-4b2-2810-c455-f308-457-aa78.ngrok-free.app/api/categories/create-category',
        { category_name: newCategory },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      
      console.log('New category created:', response.data);
      setCategories([...categories, response.data]);
      setCategory(response.data._id);
      setNewCategory('');
      alert('Đã thêm danh mục mới thành công!');
    } catch (error) {
      console.error('Error handling category:', error.response || error);
      alert('Có lỗi khi xử lý danh mục!');
    }
  };

  // Sửa lại hàm refreshCategories với endpoint đúng
  const refreshCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://059f-2405-4802-4b2-2810-c455-f308-457-aa78.ngrok-free.app/api/categories/get-all-categories',
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      console.log('Categories data:', response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Invalid categories data format:', response.data);
        alert('Dữ liệu danh mục không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.response || error);
      alert('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  // Hàm xử lý thêm variant
  const handleAddVariant = () => {
    if (!color || !size) {
      alert('Vui lòng nhập đầy đủ màu và size!');
      return;
    }

    const newVariant = {
      variant_color: color,
      variant_size: size,
      variant_price: '',
      variant_stock: 0,
      variant_image_url: '',
      isMainProduct: variants.length === 0 // Variant đầu tiên sẽ là sản phẩm chính
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
          variant_image_base64: imageData.base64, // Chỉ lưu phần data
          variant_image_type: imageData.type,
          variant_image_url: `data:${imageData.type};base64,${imageData.base64}` // URL đầy đủ để preview
        };
      } catch (error) {
        console.error('Error converting image URL:', error);
        alert('Không thể tải ảnh từ URL này. Vui lòng thử URL khác hoặc upload file ảnh.');
        return;
      }
    } else {
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
    }
    setVariants(newVariants);
  };

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (index, file) => {
    try {
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

          // Giảm chất lượng xuống 0.5 (50%)
          const base64String = canvas.toDataURL('image/jpeg', 0.5);
          const base64Data = base64String.split(',')[1]; // Lấy phần sau dấu phẩy

          const newVariants = [...variants];
          newVariants[index] = {
            ...newVariants[index],
            variant_image_base64: base64Data, // Chỉ lưu phần data
            variant_image_type: 'image/jpeg',
            variant_image_url: base64String // URL đầy đủ để preview
          };
          setVariants(newVariants);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
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

    // Hàm helper để format base64 image
    const formatBase64Image = (base64String, imageType = 'image/jpeg') => {
      if (!base64String) return '';
      // Nếu đã có prefix, trả về nguyên gốc
      if (base64String.startsWith('data:')) return base64String;
      // Nếu chưa có prefix, thêm vào
      return `data:${imageType};base64,${base64String}`;
    };

    // Chuẩn bị dữ liệu sản phẩm theo format yêu cầu
    const productData = {
      product_name: productName.trim(),
      // Đảm bảo ảnh chính có prefix đúng
      product_image: mainVariant.variant_image_base64 ? 
        formatBase64Image(mainVariant.variant_image_base64, mainVariant.variant_image_type) : '',
      product_price: parseFloat(mainVariant.variant_price) || 0,
      product_description: description.trim(),
      product_status: true,
      product_variant: variants.map(variant => ({
        // Đảm bảo ảnh variant có prefix đúng
        variant_image_base64: variant.variant_image_base64 ? 
          formatBase64Image(variant.variant_image_base64, variant.variant_image_type) : '',
        variant_image_type: variant.variant_image_type || 'image/jpeg',
        variant_color: variant.variant_color.trim(),
        variant_size: variant.variant_size.trim(),
        variant_price: parseFloat(variant.variant_price) || 0,
        variant_stock: parseInt(variant.variant_stock) || 0
      })),
      product_category: [category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Log chi tiết dữ liệu trước khi gửi
    console.log('Product Data Structure:', {
      name: productData.product_name,
      description: productData.product_description,
      category: productData.product_category,
      mainPrice: productData.product_price,
      variantsCount: productData.product_variant.length,
      hasMainImage: !!productData.product_image,
      mainImagePreview: productData.product_image.substring(0, 100) + '...',
      variants: productData.product_variant.map(v => ({
        color: v.variant_color,
        size: v.variant_size,
        price: v.variant_price,
        stock: v.variant_stock,
        hasImage: !!v.variant_image_base64,
        imagePreview: v.variant_image_base64 ? v.variant_image_base64.substring(0, 100) + '...' : 'No image'
      }))
    });

    try {
      const response = await axios.post(
        'https://059f-2405-4802-4b2-2810-c455-f308-457-aa78.ngrok-free.app/api/products/create-product',
        productData,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        }
      );
      
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
      console.error('Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

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

  return (
    <Box className="add-product-container">
      <Typography variant="h4" className="add-product-title">
        Thêm sản phẩm
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box className="form-section">
          <TextField
            required
            fullWidth
            label="Tên sản phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-field"
          />

          <Box className="category-section">
            <FormControl fullWidth>
              <InputLabel>Danh mục có sẵn</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Danh mục có sẵn"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Không chọn danh mục</em>
                </MenuItem>
                {loading ? (
                  <MenuItem disabled>
                    <em>Đang tải danh mục...</em>
                  </MenuItem>
                ) : categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>Không có danh mục nào</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <Box className="new-category-section">
              <TextField
                fullWidth
                label="Danh mục mới"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nhập tên danh mục mới"
              />
              <Button 
                variant="contained" 
                onClick={handleAddNewCategory}
                disabled={!newCategory.trim() || loading}
              >
                Thêm mới
              </Button>
              <Button
                variant="outlined"
                onClick={refreshCategories}
                disabled={loading}
                title="Tải lại danh sách danh mục"
              >
                {loading ? '...' : '↻'}
              </Button>
            </Box>
          </Box>

          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-field"
          />
        </Box>

        <Box className="variant-section">
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
        </Box>

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
    </Box>
  );
};

export default AddProduct;