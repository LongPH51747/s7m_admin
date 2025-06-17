import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./screens/LoginPage.js";
import HomeProduct from "./screens/HomeProduct.js";
import DetailProduct from "./screens/DetailProduct.js";
import ProductScreen from "./screens/ProductScreen.js";
import AddProduct from './screens/AddProduct.js';
import UpdateProduct from './screens/UpdateProduct.js';
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomeProduct />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/product" element={<ProductScreen/>} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
