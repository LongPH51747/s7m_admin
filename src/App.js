import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CategoryAdmin from './screens/CategoryAdmin';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import Users from './screens/Users';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';

// Component dùng context
import CategoryDetailProduct from './components/CategoryDetailProduct';
import OrderDetailPage from './components/OrderDetailPage';

// Context
import { OrderProvider } from './contexts/OrderContext';

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
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
