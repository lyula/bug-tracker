import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const ROOMS_URL = `${API_BASE}/rooms`;
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export const updateRoomBugStatus = async (roomId, bugId, status) => {
  const res = await axios.patch(
    `${ROOMS_URL}/${roomId}/bugs/${bugId}/status`,
    { status },
    { headers: getAuthHeaders() }
  );
  return res.data;
};
