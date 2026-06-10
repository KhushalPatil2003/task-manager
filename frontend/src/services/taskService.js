import api from '../api/axios';

const taskService = {
  
  getTasks: async (filters = {}, sort = {}, pagination = {}) => {
    const params = {};

    
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }
    if (filters.completed && filters.completed !== 'all') {
      params.completed = filters.completed; 
    }

    
    if (sort.sortBy) {
      params.sortBy = sort.sortBy;
      params.sortOrder = sort.sortOrder || 'asc';
    }

    
    if (pagination.page) {
      params.page = pagination.page;
    }
    if (pagination.limit) {
      params.limit = pagination.limit;
    }

    const response = await api.get('/tasks', { params });
    return response.data; 
  },

  
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },


  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
