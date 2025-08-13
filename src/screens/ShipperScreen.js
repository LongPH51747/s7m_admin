import React from "react";
import Sidebar from "../components/Sidebar";
import ShipperListPage from "../screens/ShipperListPage"; // ✅ default import
import TopBar from "../components/TopBar";

const ShipperScreen = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Phần nội dung chia sidebar và main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <ShipperListPage />
        </main>
      </div>
    </div>
  );
};

export default ShipperScreen;
