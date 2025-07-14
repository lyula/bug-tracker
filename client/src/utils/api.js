export const fetchBugById = async (id) => {
  const res = await axios.get(`${BUGS_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const BUGS_URL = `${API_BASE}/bugs`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchBugs = async (params = {}) => {
  const res = await axios.get(BUGS_URL, { headers: getAuthHeaders(), params });
  return res.data;
};

export const createBug = async (bug) => {
  const res = await axios.post(BUGS_URL, bug, { headers: getAuthHeaders() });
  return res.data;
};

export const updateBug = async (id, bug) => {
  const res = await axios.put(`${BUGS_URL}/${id}`, bug, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteBug = async (id) => {
  const res = await axios.delete(`${BUGS_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};
