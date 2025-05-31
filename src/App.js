import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./screens/LoginPage.jsx";
import HomeProduct from "./screens/HomeProduct.jsx";
import DetailProduct from "./components/DetailProduct.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomeProduct />} />
        <Route path="/detail/:id" element={<DetailProduct />} />
        <Route path="/product" element={<ProductScreen/>} />
      </Routes>
    </Router>
  );
}

export default App;
