import { hover } from "@testing-library/user-event/dist/hover";
import { FaRegListAlt } from "react-icons/fa";
import {
  FiBookmark,
  FiUser,
  FiBarChart,
  FiMessageCircle,
  FiBox,
} from "react-icons/fi";
import "../StyleTabBar.css";

const TabBarLef = () => {
  const menuItems = [
    { icon: <FiUser size={20} />, label: "Người dùng" },
    { icon: <FiBookmark size={20} />, label: "Danh mục" },
    { icon: <FiBox size={20} />, label: "Sản phẩm" },
    { icon: <FaRegListAlt size={20} />, label: "Đơn hàng" },
    { icon: <FiBarChart size={20} />, label: "Thống kê" },
    { icon: <FiMessageCircle size={20} />, label: "Chat" },
  ];
  return (
    <div style={{ width: 245, position: "sticky", top: 0 }}>
      <div className="menu-list">
        <a href="#">
          {menuItems[0].icon}
          <span className="label">{menuItems[0].label}</span>
        </a>
        <a href="#">
          {menuItems[1].icon}
          <span className="label">{menuItems[1].label}</span>
        </a>
        <a href="#">
          {menuItems[2].icon}
          <span className="label">{menuItems[2].label}</span>
        </a>
        <a href="#">
          {menuItems[3].icon}
          <span className="label">{menuItems[3].label}</span>
        </a>
        <a href="#">
          {menuItems[4].icon}
          <span className="label">{menuItems[4].label}</span>
        </a>
        <a href="#">
          {menuItems[5].icon}
          <span className="label">{menuItems[5].label}</span>
        </a>
      </div>
    </div>
  );
};

export default TabBarLef;
