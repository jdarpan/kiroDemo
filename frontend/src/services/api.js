import axios from 'axios';

const API_BASE_URL = '/api/accounts';

export const getDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`);
  return response.data;
};

export const searchAccounts = async (query = '') => {
  const response = await axios.get(`${API_BASE_URL}/search`, {
    params: { query }
  });
  return response.data;
};

export const getAccount = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const updateAccount = async (id, updateData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
  return response.data;
};

export const bulkUpdateAccounts = async (accountIds, updateData) => {
  const response = await axios.put(`${API_BASE_URL}/bulk`, {
    accountIds,
    updateData
  });
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
