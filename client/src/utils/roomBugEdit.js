import axios from 'axios';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || '/api';

// Update a room bug (title/description) by author or admin
export async function updateRoomBug(roomId, bugId, data) {
  // Ensure bugId is a string for consistency
  const bugIdStr = typeof bugId === 'string' ? bugId : String(bugId);
  const res = await axios.put(
    `${API_BASE}/rooms/${roomId}/bugs/${bugIdStr}`,
    data,
    { headers: getAuthHeaders() }
  );
  return res.data;
}
