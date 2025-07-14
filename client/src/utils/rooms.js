export const deleteRoom = async (roomId) => {
  const res = await axios.delete(`${ROOMS_URL}/${roomId}`, { headers: getAuthHeaders() });
  return res.data;
};
// Fetch all bugs for a room
export const fetchRoomBugs = async (roomId) => {
  const res = await axios.get(`${ROOMS_URL}/${roomId}/bugs`, { headers: getAuthHeaders() });
  return res.data;
};

// Create a bug in a room
export const createRoomBug = async (roomId, bug) => {
  const res = await axios.post(`${ROOMS_URL}/${roomId}/bugs`, bug, { headers: getAuthHeaders() });
  return res.data;
};
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const ROOMS_URL = `${API_BASE}/rooms`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createRoom = async (name) => {
  const res = await axios.post(`${ROOMS_URL}/create`, { name }, { headers: getAuthHeaders() });
  return res.data;
};

export const joinRoom = async (code) => {
  const res = await axios.post(`${ROOMS_URL}/join`, { code }, { headers: getAuthHeaders() });
  return res.data;
};

export const getMyRooms = async () => {
  const res = await axios.get(`${ROOMS_URL}/my`, { headers: getAuthHeaders() });
  return res.data;
};

export const getRoom = async (id) => {
  const res = await axios.get(`${ROOMS_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};
