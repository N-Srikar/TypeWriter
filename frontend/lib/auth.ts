import api from './api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};