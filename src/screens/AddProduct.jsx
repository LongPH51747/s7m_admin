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

  // Thêm useEffect để lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/categories/get-categories',
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

  // Hàm xử lý thêm danh mục mới
  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await axios.post(
        'https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/categories/create-category',
        { category_name: newCategory },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      
      setCategories([...categories, response.data]);
      setCategory(response.data._id);
      setNewCategory('');
    } catch (error) {
      console.error('Error creating category:', error.response || error);
      alert('Có lỗi khi thêm danh mục mới!');
    }
  };

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
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    setVariants(newVariants);
  };

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (index, file) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const imageType = file.type;
        const newVariants = [...variants];
        newVariants[index] = {
          ...newVariants[index],
          variant_image_base64: base64String,
          variant_image_type: imageType,
          variant_image_url: reader.result // Để preview
        };
        setVariants(newVariants);
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

    const mainVariant = variants[0];
    const productData = {
      product_name: productName,
      product_category: category ? [category] : [],
      product_price: parseFloat(mainVariant.variant_price),
      product_description: description,
      product_status: true,
      product_image: mainVariant.variant_image_url,
      product_variant: variants.slice(1).map(variant => ({
        variant_image_base64: variant.variant_image_base64,
        variant_image_type: variant.variant_image_type,
        variant_color: variant.variant_color,
        variant_size: variant.variant_size,
        variant_price: parseFloat(variant.variant_price),
        variant_stock: parseInt(variant.variant_stock)
      }))
    };

    console.log('Sending product data:', productData);

    try {
      const response = await axios.post(
        'https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/products/create-product',
        productData,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      
      console.log('Product created successfully:', response.data);
      alert('Thêm sản phẩm thành công!');
      
      // Reset form
      setProductName('');
      setCategory('');
      setNewCategory('');
      setDescription('');
      setVariants([]);
    } catch (error) {
      console.error('Error creating product:', error.response || error);
      let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm!';
      
      if (error.response) {
        errorMessage += ` (${error.response.status}: ${error.response.data?.message || error.response.statusText})`;
      } else if (error.request) {
        errorMessage += ' (Không thể kết nối đến server)';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Thêm sản phẩm
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            required
            fullWidth
            label="Tên sản phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Danh mục có sẵn</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Danh mục có sẵn"
              >
                <MenuItem value="">
                  <em>Không chọn danh mục</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
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
                disabled={!newCategory.trim()}
              >
                Thêm mới
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
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thêm biến thể
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          <TableContainer component={Paper} sx={{ mb: 3 }}>
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
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                          style={{ display: 'none' }}
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
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
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