import { Platform } from 'react-native';

const API_URL = 'https://todo-list.dobleb.cl';

export const savePhotoForUser = async (
  userId: string,
  localUri: string,
  token?: string,
): Promise<string> => {
  if (!localUri) {
    throw new Error('No se recibió una imagen válida');
  }

  const formData = new FormData();

  if (Platform.OS === 'web') {
    // 🔴 CLAVE PARA WEB
    const response = await fetch(localUri);
    const blob = await response.blob();

    formData.append('file', blob, 'photo.jpg');
  } else {
    // 📱 iOS / Android
    formData.append('file', {
      uri: localUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  }

  const response = await fetch(`${API_URL}/images`, {
    method: 'POST',
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir la imagen');
  }

  const json = await response.json();

  // ✅ La API devuelve la URL pública
  return json.data.url;
};

export const deleteManagedPhoto = async (_photoUri?: string) => {
  return;
};
