import React from 'react';

const HeaderTwo = () => {
  return (
    <header className="w-full flex items-center py-4 px-6 border-b bg-white">
      {/* Logo bên trái */}
      <div className="text-xl font-bold">S7M STORE</div>

      {/* Nav nằm giữa */}
      <nav className="flex gap-8 text-base mx-auto">
        {/* <a href="#">Home</a>
        <a href="#">Contact</a>
        <a href="#">About</a>
        <a href="#" className="font-semibold">Sign Up</a> */}
      </nav>

      {/* Phần div trống bên phải để giữ bố cục cân đối */}
      <div className="w-[250px]"></div>
    </header>
  );
};

export default HeaderTwo;
