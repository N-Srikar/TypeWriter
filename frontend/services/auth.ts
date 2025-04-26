import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    email,
    password
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};