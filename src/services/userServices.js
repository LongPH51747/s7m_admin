import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const USER_API = `${API_BASE}/users`;


export const getAllUsers = async () => {
  const response = await axios.get(`${USER_API}/get-all-users`);
  return response.data;
};


export const updateUserPermission = async (userId, is_allowed) => {
 await axios.patch(`${USER_API}/update-status-user/id/${userId}/status`, {
    is_allowed,
  });

};
