import { Task } from '@/types/task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type TaskPayload = {
  title: string;
  description: string;
  locationName: string;
  photoUri: string;
};

export async function getTasks(): Promise<Task[]> {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  return json.data;
}

// ✅ CREAR TAREA (MULTIPART REAL)
export async function createTask(
  data: TaskPayload,
): Promise<boolean> {
  const token = await AsyncStorage.getItem('token');

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('locationName', data.locationName);
  formData.append('image', {
    uri: data.photoUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ NO poner Content-Type
    },
    body: formData,
  });

  return res.ok;
}

// ✅ ACTUALIZAR TAREA
export async function updateTask(
  id: string,
  data: TaskPayload,
): Promise<boolean> {
  const token = await AsyncStorage.getItem('token');

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('locationName', data.locationName);
  formData.append('image', {
    uri: data.photoUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.ok;
}

export async function deleteTask(id: string): Promise<void> {
  const token = await AsyncStorage.getItem('token');

  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
