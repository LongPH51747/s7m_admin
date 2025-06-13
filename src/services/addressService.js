import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const ADDRESS_API = `${API_BASE}/address`;

export const getByIdAddress = async (id) =>{
 try {
     console.log("đã nhảy vào getByIdAddress");
    
    const response = await axios.get(`${ADDRESS_API}/getById/${id}`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy responseAddress");
  
  console.log("responseAddress", response.data);
  return response.data
 } catch (error) {
    console.log("error", error);
    
 }
};

export const getFullNameAtAddress = async (id) =>{
 try {
     console.log("đã nhảy vào getFullNameAtAddress");
    
    const response = await axios.get(`${ADDRESS_API}/getById/${id}`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy responseFullName");
  
  console.log("responseFullName", response.data.fullName);
  return response.data.fullName;
 } catch (error) {
    console.log("error", error);
    
 }
}