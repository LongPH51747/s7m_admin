import React from 'react'
import TopBar from '../components/TopBar'
import TabDraw from '../components/TabDraws'
import ProductList from '../components/ProductList'
import Footer from '../components/Footer'
import "../css/ProductScreen.css";

const ProductScreen = () => {
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
                        <button className='btn-add-product'>Thêm sản phẩm</button>
                    </div>
                    <ProductList/>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ProductScreen