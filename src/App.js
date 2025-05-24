import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryAdmin from './screens/CategoryAdmin.js';
import CategoryDetailScreen from './screens/CategoryDetailScreen.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryAdmin />} />
        <Route path="/category/:categorySlug" element={<CategoryDetailScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
