import { memo, useEffect } from 'react';
import { Pressable, Text, View, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  FadeInDown, 
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { Task } from '@/types/task';

export type TaskItemProps = {
  task: Task;
  onToggleCompleted: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export const TaskItem = memo(({ task, onToggleCompleted, onEdit, onDelete }: TaskItemProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const checkboxScale = useSharedValue(1);

  const toggle = () => {
    // Animación de pulso al cambiar estado
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    // Animación del checkbox
    checkboxScale.value = withSpring(1.2, { damping: 5 }, () => {
      checkboxScale.value = withSpring(1);
    });
    
    onToggleCompleted(task.id);
  };

  const edit = () => onEdit(task);
  
  const remove = () => {
    if (Platform.OS === 'web') {
      if (confirm(`¿Eliminar "${task.title}"?`)) {
        onDelete(task.id);
      }
    } else {
      Alert.alert(
        'Eliminar tarea',
        `¿Estás seguro de eliminar "${task.title}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(task.id) },
        ],
        { cancelable: true }
      );
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    // Fade in/out cuando cambia el estado de completado
    opacity.value = withTiming(task.completed ? 0.7 : 1, { duration: 300 });
  }, [task.completed, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkboxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutRight.duration(300)}
    >
      <Animated.View
        style={animatedStyle}
        className="flex-row items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/5"
      >
      <Pressable
        accessibilityLabel={`Marcar tarea ${task.title} como ${task.completed ? 'pendiente' : 'completada'}`}
        accessibilityRole="button"
        onPress={toggle}
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        className="justify-center pt-0.5"
      >
        <Animated.View
          style={checkboxAnimatedStyle}
          className={`h-[24px] w-[24px] items-center justify-center rounded-md border-2 ${
            task.completed ? 'border-blue-500 bg-blue-500' : 'border-slate-400 bg-white'
          }`}
        >
          {task.completed && (
            <Text className="text-white text-base font-bold leading-none">✓</Text>
          )}
        </Animated.View>
      </Pressable>
      <Pressable className="flex-1" onPress={edit}>
        {task.photoUri ? (
          <Image
            source={{ uri: task.photoUri }}
            style={{ marginBottom: 12, height: 160, width: '100%', borderRadius: 12 }}
            contentFit="cover"
          />
        ) : null}
        <Text
          className={`text-lg font-semibold text-slate-900 ${
            task.completed ? 'text-slate-500 line-through' : ''
          }`}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text
            className={`mt-1 text-base text-slate-600 ${
              task.completed ? 'text-slate-400 line-through' : ''
            }`}
          >
            {task.description}
          </Text>
        ) : null}
        <View className="mt-2 gap-1">
          <Text className="text-sm text-slate-500">📍 {task.locationName}</Text>
          <Text className="text-xs text-slate-400">{formatDate(task.updatedAt)}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${task.title}`}
        onPress={remove}
        style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
        className="self-center rounded-lg bg-red-500 px-3 py-1.5"
      >
        <Text className="text-xs font-semibold text-white">✕</Text>
      </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

TaskItem.displayName = 'TaskItem';
