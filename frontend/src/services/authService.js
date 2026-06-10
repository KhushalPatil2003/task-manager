import api from '../api/axios';

const authService = {
  
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data; 
  },


  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; 
  }
};

export default authService;
