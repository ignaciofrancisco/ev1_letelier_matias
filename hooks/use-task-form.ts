import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';

import { TaskFormHandle } from '@/components/tasks/task-form';
import { Task } from '@/types/task';

const FALLBACK_LOCATION = 'Ubicación sin nombre';

const composeLocationName = (
  address?: Location.LocationGeocodedAddress,
) => {
  if (!address) return FALLBACK_LOCATION;

  const segments = [
    address.name,
    address.district,
    address.city,
    address.region,
    address.country,
  ]
    .map((s) => s?.trim())
    .filter(Boolean) as string[];

  return segments.length
    ? [...new Set(segments)].join(', ')
    : FALLBACK_LOCATION;
};

type TaskPayload = {
  title: string;
  description: string;
  locationName: string;
  photoUri: string;
};

type UseTaskFormProps = {
  userId?: string;
  onAddTask: (task: TaskPayload) => Promise<boolean>;
  onUpdateTask: (id: string, task: TaskPayload) => Promise<boolean>;
};

export const useTaskForm = ({
  userId,
  onAddTask,
  onUpdateTask,
}: UseTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoLocalUri, setPhotoLocalUri] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isProcessingTask, setIsProcessingTask] = useState(false);

  const formRef = useRef<TaskFormHandle>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPhotoLocalUri(null);
    setLocationName('');
    setEditingTask(null);
    setFormError(null);
    setIsProcessingTask(false);
    formRef.current?.focusTitle();
  };

  // =========================
  // 📤 GUARDAR TAREA
  // =========================
  const handleSubmit = async () => {
    if (isProcessingTask) return;

    const trimmedTitle = title.trim();
    const trimmedLocation = locationName.trim();

    if (!trimmedTitle) {
      setFormError('El título es obligatorio');
      formRef.current?.focusTitle();
      return;
    }

    if (!photoLocalUri) {
      setFormError('Debes tomar una foto.');
      return;
    }

    if (!trimmedLocation) {
      setFormError('Debes capturar la ubicación.');
      return;
    }

    if (!userId) {
      setFormError('Sesión inválida.');
      return;
    }

    try {
      setIsProcessingTask(true);

      const payload: TaskPayload = {
        title: trimmedTitle,
        description: description.trim(),
        locationName: trimmedLocation,
        photoUri: photoLocalUri,
      };

      const success = editingTask
        ? await onUpdateTask(editingTask.id, payload)
        : await onAddTask(payload);

      if (!success) {
        setFormError('No se pudo guardar la tarea.');
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
        }
        return;
      }

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      }

      resetForm();
    } catch (error) {
      console.error('ERROR AL GUARDAR:', error);
      setFormError('No pudimos guardar tu tarea.');
    } finally {
      setIsProcessingTask(false);
    }
  };

  // =========================
  // 📸 CAPTURAR FOTO
  // =========================
  const handleCapturePhoto = async () => {
    setFormError(null);

    try {
      setIsCapturingPhoto(true);

      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        setFormError('Permiso de cámara denegado.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.3, // evita 413
        allowsEditing: false,
      });

      if (!result.canceled && result.assets?.length) {
        setPhotoLocalUri(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Error capturando imagen', error);
      setFormError('No pudimos abrir la cámara.');
    } finally {
      setIsCapturingPhoto(false);
    }
  };

  // =========================
  // 📍 UBICACIÓN
  // =========================
  const handleDetectLocation = async () => {
    setFormError(null);

    try {
      setIsDetectingLocation(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setFormError('Permiso de ubicación denegado.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      try {
        const [address] =
          await Location.reverseGeocodeAsync(position.coords);
        setLocationName(composeLocationName(address));
      } catch {
        setLocationName('Ubicación detectada');
      }
    } catch (error) {
      console.warn('Error obteniendo ubicación', error);
      setFormError('No se pudo obtener la ubicación.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // =========================
  // ✏️ EDITAR
  // =========================
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPhotoLocalUri(null); // backend exige imagen nueva
    setLocationName(task.locationName ?? '');
    setFormError(null);
    formRef.current?.focusTitle();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    photoLocalUri,
    locationName,
    setLocationName,
    editingTask,
    formError,
    isCapturingPhoto,
    isDetectingLocation,
    isProcessingTask,
    formRef,
    resetForm,
    handleSubmit,
    handleCapturePhoto,
    handleDetectLocation,
    handleEdit,
  };
};
