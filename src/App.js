import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryAdmin from './screens/CategoryAdmin.js';
import CategoryDetailScreen from './screens/CategoryDetailScreen.js';
import Users from './screens/Users.js';
import Orders from './screens/Orders.js';
import OrderDetail from './screens/OrderDetail.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/categories" element={<CategoryAdmin />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/category/:categorySlug" element={<CategoryDetailScreen />} />
        <Route path="/orders/:orderCode" element={<OrderDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
