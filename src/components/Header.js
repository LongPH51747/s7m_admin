import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="w-full flex items-center py-4 px-6 border-b bg-white">
      {/* Logo bên trái */}
      <div className="text-xl font-bold">S7M STORE</div>

      {/* Nav nằm giữa */}
      <nav className="flex gap-8 text-base mx-auto">
        <a href="#">Home</a>
        <a href="#">Contact</a>
        <a href="#">About</a>
        <a href="#" className="font-semibold">Sign Up</a>
      </nav>

      {/* Thanh tìm kiếm bên phải */}
      <div className="relative w-[250px]">
        <input
          type="search"
          placeholder="What are you looking for?"
          className="bg-gray-100 pl-4 pr-10 py-2 rounded w-full focus:outline-none"
        />
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
      </div>
    </header>
  );
};

export default Header;
