import { Pressable, Text, View } from 'react-native';

import { TaskFilter } from '@/types/task';

const FILTERS: { id: TaskFilter; label: string; emoji: string }[] = [
  { id: 'all', label: 'Todas', emoji: '📋' },
  { id: 'pending', label: 'Pendientes', emoji: '⏳' },
  { id: 'completed', label: 'Completadas', emoji: '✅' },
];

export type TaskFilterProps = {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  counts: {
    total: number;
    pending: number;
    completed: number;
  };
};

export const TaskFilterSegment = ({ value, onChange, counts }: TaskFilterProps) => {
  return (
    <View className="mb-4 flex-row items-center justify-center gap-2">
      {FILTERS.map((filter) => {
        const isActive = value === filter.id;
        const count =
          filter.id === 'all'
            ? counts.total
            : filter.id === 'pending'
            ? counts.pending
            : counts.completed;

        return (
          <Pressable
            key={filter.id}
            onPress={() => onChange(filter.id)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar ${filter.label}: ${count} tareas`}
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            className={`flex-1 rounded-full border-2 px-3 py-2.5 shadow-sm ${
              isActive 
                ? 'border-blue-600 bg-blue-600' 
                : 'border-slate-300 bg-white'
            }`}
          >
            <Text
              className={`text-center text-sm font-bold ${
                isActive ? 'text-white' : 'text-slate-700'
              }`}
            >
              {filter.emoji} {filter.label}
              <Text className={`text-xs font-semibold ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                {' '}({count})
              </Text>
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
