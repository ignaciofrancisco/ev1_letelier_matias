import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { SlideInDown } from 'react-native-reanimated';

export type TaskStatsBannerProps = {
  total: number;
  pending: number;
  completed: number;
};

export const TaskStatsBanner = ({ total, pending, completed }: TaskStatsBannerProps) => {
  const router = useRouter();
  
  if (total === 0) return null;

  const completionRate = Math.round((completed / total) * 100);

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
    >
      <Pressable 
        onPress={() => router.push('/modal')}
        className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 shadow-lg"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-blue-100">Tu progreso</Text>
            <Text className="text-3xl font-bold text-white">{completionRate}%</Text>
            <Text className="text-xs text-blue-100">
              {completed} de {total} completadas
            </Text>
          </View>
          
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <Text className="text-4xl">{completionRate >= 100 ? '🎉' : completionRate >= 50 ? '💪' : '📝'}</Text>
          </View>
        </View>

        {pending > 0 && (
          <View className="mt-3 rounded-lg bg-white/10 px-3 py-2">
            <Text className="text-center text-xs font-semibold text-white">
              ⏳ {pending} tarea{pending > 1 ? 's' : ''} pendiente{pending > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <Text className="mt-2 text-center text-xs text-blue-100">
          👆 Toca para ver estadísticas completas
        </Text>
      </Pressable>
    </Animated.View>
  );
};
