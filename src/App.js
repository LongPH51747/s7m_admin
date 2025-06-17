import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryAdmin from './screens/CategoryAdmin';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import Users from './screens/Users';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
// Component dùng context
import CategoryDetailProduct from './components/OrderList';
// import OrderDetailPage from './components/OrderDetailPage';
// Context
import { OrderProvider } from './contexts/OrderContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./screens/LoginPage.jsx";
import HomeProduct from "./screens/HomeProduct.jsx";
import DetailProduct from "./screens/DetailProduct.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import AddProduct from './screens/AddProduct';
import UpdateProduct from './screens/UpdateProduct';


function App() {
  return (
    <OrderProvider>
      <Router basename="/LongPH51747/s7m_admin">
        <Routes>
          <Route path="/" element={<CategoryAdmin />} />
          <Route path="/categories" element={<CategoryAdmin />} />
          <Route path="/category/:categorySlug" element={<CategoryDetailScreen />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderCode" element={<OrderDetail />} />
          <Route path="/order-list" element={<CategoryDetailProduct />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomeProduct />} />
          <Route path="/product/:id" element={<DetailProduct />} />
          <Route path="/product" element={<ProductScreen />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<UpdateProduct />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
