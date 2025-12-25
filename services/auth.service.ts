import { User } from '@/types/user';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface LoginApiResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export async function loginService(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  if (!API_URL) {
    throw new Error('API URL no configurada');
  }

  const response = await axios.post<LoginApiResponse>(
    `${API_URL}/auth/login`,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (!response.data.success) {
    throw new Error('Credenciales inválidas');
  }

  return response.data.data; // 👈 CLAVE
}
