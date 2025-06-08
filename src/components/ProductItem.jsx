import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';

const ProductItem = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       const response = await axios.get('https://0185-2405-4802-21f-72d0-c451-84e5-9b5b-457a.ngrok-free.app/api/products/get-all-products', {
      headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }});
        setProducts(response.data);
        console.log("Response data:", response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3 }}>      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={  product.product_image || 'https://via.placeholder.com/200'}
                  alt={product.product_name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.product_name}
                  </Typography>
                  {/* <Rating value={product.rate} precision={0.5} readOnly /> */}
                  <Typography variant="body2" color="text.secondary">
                    {product.product_description.substring(0, 50)}...
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {product.product_price.toLocaleString('vi-VN')}VND
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductItem;