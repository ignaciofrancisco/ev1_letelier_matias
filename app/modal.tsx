import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/hooks/use-tasks';

export default function ModalScreen() {
  const { tasks, pendingCount, completedCount, clearCompleted } = useTasks();
  const [isClearing, setIsClearing] = useState(false);

  const total = tasks.length;

  const completionRate = useMemo(() => {
    if (!total) {
      return 0;
    }
    return Math.round((completedCount / total) * 100);
  }, [completedCount, total]);

  const handleClear = async () => {
    if (isClearing || completedCount === 0) {
      return;
    }

    setIsClearing(true);
    try {
      await clearCompleted();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 32,
          gap: 24,
        }}
      >
        <View className="gap-2">
          <Text className="text-3xl font-bold text-slate-900">
            📊 Resumen de Productividad
          </Text>
          <Text className="text-base text-slate-600">
            Visualiza estadísticas de tus tareas y mantén el foco en lo que falta por completar.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between gap-4">
          <View className="min-w-[140px] flex-1 rounded-2xl bg-blue-50 p-5 shadow-sm">
            <Text className="text-base font-semibold text-blue-600">📋 Total</Text>
            <Text className="text-4xl font-bold text-blue-900">{total}</Text>
            <Text className="mt-1 text-xs text-blue-700">Tareas registradas</Text>
          </View>

          <View className="min-w-[140px] flex-1 rounded-2xl bg-emerald-50 p-5 shadow-sm">
            <Text className="text-base font-semibold text-emerald-600">✅ Completadas</Text>
            <Text className="text-4xl font-bold text-emerald-900">{completedCount}</Text>
            <Text className="mt-1 text-xs text-emerald-700">Tareas finalizadas</Text>
          </View>

          <View className="min-w-[140px] flex-1 rounded-2xl bg-amber-50 p-5 shadow-sm">
            <Text className="text-base font-semibold text-amber-600">⏳ Pendientes</Text>
            <Text className="text-4xl font-bold text-amber-900">{pendingCount}</Text>
            <Text className="mt-1 text-xs text-amber-700">Por resolver</Text>
          </View>
        </View>

        <View className="rounded-2xl bg-slate-100 p-5 shadow-sm">
          <Text className="text-base font-bold text-slate-800">
            🎯 Progreso General
          </Text>

          <View className="mt-4 h-4 w-full overflow-hidden rounded-full bg-slate-300">
            <View
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${completionRate}%` }}
            />
          </View>

          <Text className="mt-3 text-center text-lg font-bold text-slate-700">
            {completionRate}% completado
          </Text>

          {total > 0 && (
            <Text className="mt-1 text-center text-sm text-slate-500">
              {completedCount} de {total} tareas finalizadas
            </Text>
          )}
        </View>

        {completedCount > 0 && (
          <Pressable
            onPress={handleClear}
            disabled={isClearing}
            className="items-center rounded-xl border-2 border-red-300 bg-red-50 py-3.5 shadow-sm"
            accessibilityRole="button"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
          >
            <Text className="text-base font-bold text-red-600">
              {isClearing
                ? '🧹 Limpiando…'
                : `🗑️ Limpiar tareas completadas (${completedCount})`}
            </Text>
          </Pressable>
        )}

        {total === 0 && (
          <View className="items-center rounded-xl bg-slate-50 p-8">
            <Text className="text-4xl">📝</Text>
            <Text className="mt-3 text-center text-base font-semibold text-slate-700">
              No hay tareas registradas
            </Text>
            <Text className="mt-1 text-center text-sm text-slate-500">
              Comienza agregando tu primera tarea en la pantalla principal
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
