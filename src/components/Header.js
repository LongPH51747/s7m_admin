import React from 'react';

const Header = () => (
  <div className="flex justify-between items-center py-4 px-6 border-b">
    <nav className="flex gap-8">
      <a href="#">Home</a>
      <a href="#">Contact</a>
      <a href="#">About</a>
      <a href="#" className="font-semibold">Sign Up</a>
    </nav>
    <input type="search" placeholder="What are you looking for?" className="border rounded p-2"/>
  </div>
);

export default Header;
