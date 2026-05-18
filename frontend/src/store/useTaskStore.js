import { create } from 'zustand';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const useTaskStore = create((set, get) => ({
  tasks: [],
  stats: null,
  loading: false,
  statsLoading: false,
  filters: { status: '', priority: '', search: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { filters } = get();
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const res = await taskService.getTasks(params);
      set({ tasks: res.data });
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const res = await taskService.getDashboardStats();
      set({ stats: res.data });
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      set({ statsLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      const res = await taskService.createTask(data);
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
      toast.success('Task created!');
      get().fetchStats();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await taskService.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? res.data : t)),
      }));
      toast.success('Task updated!');
      get().fetchStats();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.deleteTask(id);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      toast.success('Task deleted');
      get().fetchStats();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  },
}));

export default useTaskStore;
