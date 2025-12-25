import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL no está definida');
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Options {
  method?: Method;
  body?: any;
  auth?: boolean;
}

export async function api<T>(
  endpoint: string,
  { method = 'GET', body, auth = true }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await AsyncStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorBody: any = null;
  
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }
  
    console.error('API ERROR:', errorBody);
    throw errorBody;
  }
  

  return res.json();
}
