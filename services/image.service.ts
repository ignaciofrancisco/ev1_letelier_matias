import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function uploadImage(uri: string): Promise<string> {
  if (!API_URL) throw new Error('API URL no definida');

  const token = await AsyncStorage.getItem('token');

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_URL}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al subir imagen');
  }

  const json = await res.json();


  return json.data.path;
}
