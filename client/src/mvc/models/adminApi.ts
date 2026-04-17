// Admin API service layer
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Auth
export const adminLogin = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Admin Playground CRUD
export const fetchPlaygroundItems = async () => {
  const res = await fetch(`${API_BASE}/admin/playground`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const createPlaygroundItem = async (item: any) => {
  const res = await fetch(`${API_BASE}/admin/playground`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updatePlaygroundItem = async (id: string, updates: any) => {
  const res = await fetch(`${API_BASE}/admin/playground/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deletePlaygroundItem = async (id: string) => {
  const res = await fetch(`${API_BASE}/admin/playground/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Settings
export const fetchSettings = async () => {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateSettings = async (updates: any) => {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Image Upload
export const uploadImage = async (file: File, folder: string = 'general') => {
  const token = localStorage.getItem('adminToken');
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/admin/upload?folder=${folder}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
