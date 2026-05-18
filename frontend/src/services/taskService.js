import axiosInstance from '../api/axiosInstance';

export const taskService = {
  getTasks: (params) => axiosInstance.get('/tasks', { params }),
  getTask: (id) => axiosInstance.get(`/tasks/${id}`),
  createTask: (data) => axiosInstance.post('/tasks', data),
  updateTask: (id, data) => axiosInstance.put(`/tasks/${id}`, data),
  deleteTask: (id) => axiosInstance.delete(`/tasks/${id}`),
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
};
