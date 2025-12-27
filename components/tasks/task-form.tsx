import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type TaskFormHandle = {
  focusTitle: () => void;
  focusDescription: () => void;
};

export type TaskFormProps = {
  title: string;
  description: string;
  photoUri: string | null;
  locationName: string;
  isEditing: boolean;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeLocationName: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  onCancelEdit?: () => void;
  onCapturePhoto: () => void;
  onRemovePhoto: () => void;
  onDetectLocation: () => void;
  isCapturingPhoto?: boolean;
  isDetectingLocation?: boolean;
  isSaving?: boolean;
  error?: string | null;
};

const TaskFormComponent = (
  {
    title,
    description,
    photoUri,
    locationName,
    isEditing,
    onChangeTitle,
    onChangeDescription,
    onChangeLocationName,
    onSubmit,
    onCancelEdit,
    onCapturePhoto,
    onRemovePhoto,
    onDetectLocation,
    isCapturingPhoto,
    isDetectingLocation,
    isSaving,
    error,
  }: TaskFormProps,
  ref: ForwardedRef<TaskFormHandle>,
) => {
  const titleRef = useRef<TextInput | null>(null);
  const descriptionRef = useRef<TextInput | null>(null);
  const buttonScale = useSharedValue(1);

  useImperativeHandle(
    ref,
    () => ({
      focusTitle: () => titleRef.current?.focus(),
      focusDescription: () => descriptionRef.current?.focus(),
    }),
    [],
  );

  const focusDescription: TextInputProps['onSubmitEditing'] = () => {
    descriptionRef.current?.focus();
  };

  const handleSubmitPress = () => {
    // Animación de pulso al presionar
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    onSubmit();
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View className="mb-6 gap-3">
      <View>
        <TextInput
          ref={(input) => {
            titleRef.current = input;
          }}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
          placeholder="Título de la tarea *"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={onChangeTitle}
          returnKeyType="next"
          onSubmitEditing={focusDescription}
          maxLength={100}
        />
        <Text className="mt-1 text-right text-xs text-slate-400">
          {title.length}/100
        </Text>
      </View>
      <View>
        <TextInput
          ref={(input) => {
            descriptionRef.current = input;
          }}
          className="min-h-[90px] rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
          placeholder="Descripción (opcional)"
          placeholderTextColor="#94a3b8"
          value={description}
          multiline
          onChangeText={onChangeDescription}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text className="mt-1 text-right text-xs text-slate-400">
          {description.length}/500
        </Text>
      </View>
      <View className="gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-slate-700">Foto de la tarea *</Text>
          <Pressable
            onPress={onCapturePhoto}
            disabled={isCapturingPhoto}
            className={`rounded-full border border-blue-600 px-3 py-1 ${isCapturingPhoto ? 'opacity-60' : ''}`}
          >
            <Text className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {isCapturingPhoto ? 'Capturando…' : photoUri ? 'Reemplazar' : 'Tomar foto'}
            </Text>
          </Pressable>
        </View>
        {photoUri ? (
          <View className="gap-2">
            <Image source={{ uri: photoUri }} style={{ height: 160, width: '100%', borderRadius: 12 }} contentFit="cover" />
            <Pressable
              onPress={onRemovePhoto}
              className="items-center rounded-lg border border-red-200 py-1.5"
            >
              <Text className="text-xs font-semibold text-red-500">Quitar foto</Text>
            </Pressable>
          </View>
        ) : (
          <Text className="text-sm text-slate-500">
            Necesitas adjuntar una imagen tomada desde la cámara del dispositivo.
          </Text>
        )}
      </View>
      <View className="rounded-2xl border-2 border-slate-300 bg-slate-50 p-4">
        <Text className="text-base font-semibold text-slate-700">Ubicación *</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Guardamos el nombre de la ubicación, no las coordenadas exactas.
        </Text>
        <TextInput
          className="mt-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
          placeholder="Ej. Biblioteca Campus San Andrés"
          placeholderTextColor="#94a3b8"
          value={locationName}
          onChangeText={onChangeLocationName}
          maxLength={140}
        />
        <Text className="mt-1 text-right text-xs text-slate-400">{locationName.length}/140</Text>
        <Pressable
          onPress={onDetectLocation}
          disabled={isDetectingLocation}
          className={`mt-3 items-center rounded-2xl border border-slate-300 py-2 ${isDetectingLocation ? 'opacity-60' : ''}`}
        >
          <Text className="text-sm font-semibold text-slate-700">
            {isDetectingLocation ? 'Buscando ubicación…' : 'Usar mi ubicación actual'}
          </Text>
        </Pressable>
        <Text className="mt-2 text-xs text-slate-500">
          También puedes editar manualmente el nombre del lugar si lo prefieres.
        </Text>
      </View>
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
      <Animated.View style={animatedButtonStyle}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmitPress}
          disabled={isSaving}
          className={`items-center rounded-xl bg-blue-600 py-3.5 shadow-sm shadow-blue-600/30 ${isSaving ? 'opacity-70' : ''}`}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Text className="text-base font-bold text-white">
            {isSaving ? '⏳ Guardando…' : isEditing ? '💾 Guardar cambios' : '➕ Agregar tarea'}
          </Text>
        </Pressable>
      </Animated.View>
      {isEditing && onCancelEdit ? (
        <Pressable 
          className="items-center rounded-lg border-2 border-slate-300 py-2" 
          onPress={onCancelEdit}
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
        >
          <Text className="font-semibold text-slate-700">Cancelar edición</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(TaskFormComponent);
