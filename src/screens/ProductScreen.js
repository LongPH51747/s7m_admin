import React from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import TabDraw from '../components/TabDraws'
import ProductItem from '../components/ProductItem'
import Footer from '../components/Footer'
import "../css/ProductScreen.css";

const ProductScreen = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  return (
    <>
    <TopBar/>
        <div className='container-product'>
            <div className='body'>
                <div className='left-content'>
                    <TabDraw/>    
                </div>
                <div className='right-content'>
                    <h2 className='product-title'>Danh sách sản phẩm</h2>
                    <div className='button-add'>
                        <button 
                          className='btn-add-product'
                          onClick={handleAddProduct}
                        >
                          Thêm sản phẩm
                        </button>
                    </div>
                    <ProductItem/>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ProductScreen