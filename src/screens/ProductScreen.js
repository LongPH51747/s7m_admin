import React from "react";
import TopBar from "../components/TopBar";
import ProductItem from "../components/ProductItem";
import "../css/ProductScreen.css";
import Sidebar from "../components/Sidebar";
const ProductScreen = () => {
  return (
    <>
      <TopBar />
      <div className="container-product">
        <div className="body">
          <Sidebar />

          <ProductItem />
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
