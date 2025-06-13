import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const USER_API = `${API_BASE}/users`;


export const getAllUsers = async () => {
 try {
    console.log("đã nhảy vào getAllUser");
    
    const response = await axios.get(`${USER_API}/get-all-users`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy responseCate");
  
  console.log("responseCate", response.data);
  
  const users = Array.isArray(response.data)
  ? response.data
  : Array.isArray(response.data?.data)
  ? response.data.data
  : [];
  
  if (!Array.isArray(users)) {
    throw new Error("❌ Dữ liệu trả về không phải là mảng.");
  }
  
  return users;
} catch (error) {
  console.log("eror: ", error);
    
}
};


export const updateUserPermission = async (userId, is_allowed) => {
 await axios.patch(`${USER_API}/update-status-user/id/${userId}/status`, 
    is_allowed,
  );

};
