import * as Haptics from 'expo-haptics';
import { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/tasks/search-bar';
import { TaskFilterSegment } from '@/components/tasks/task-filter';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskList } from '@/components/tasks/task-list';
import { TaskStatsBanner } from '@/components/tasks/task-stats-banner';
import { useAuth } from '@/hooks/use-auth';
import { useTaskForm } from '@/hooks/use-task-form';
import { useTasks } from '@/hooks/use-tasks';
import { deleteManagedPhoto } from '@/utils/task-media';

export default function HomeScreen() {
  const {
    tasks,
    filteredTasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    clearCompleted,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    pendingCount,
    completedCount,
  } = useTasks();

  const { user, signOut } = useAuth();

  const {
    title,
    setTitle,
    description,
    setDescription,
    photoUri,
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
    handleRemovePhoto,
    handleDetectLocation,
    handleEdit,
  } = useTaskForm({
    userId: user?.id,
    onAddTask: addTask,
    onUpdateTask: updateTask,
  });

  const totalTasks = tasks.length;

  const handleDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && Platform.OS === 'web') {
      if (!confirm(`¿Eliminar "${task.title}"?`)) return;
    }

    removeTask(id);

    if (task?.photoUri) {
      deleteManagedPhoto(task.photoUri);
    }

    if (editingTask?.id === id) {
      resetForm();
    }
  };

  const handleClearCompleted = () => {
    const completed = tasks.filter((t) => t.completed);
    if (!completed.length) return;

    const execute = async () => {
      await clearCompleted();
      await Promise.all(
        completed.map((t) => t.photoUri && deleteManagedPhoto(t.photoUri)),
      );
    };

    if (Platform.OS === 'web') {
      if (confirm(`¿Eliminar ${completed.length} tareas completadas?`)) {
        execute().catch(() => {});
      }
      return;
    }

    Alert.alert(
      'Eliminar tareas completadas',
      `Se eliminarán ${completed.length} tareas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: execute },
      ],
    );
  };

  const handleToggle = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleTask(id);
  };

  useEffect(() => {
    if (!editingTask) return;

    const latest = tasks.find((t) => t.id === editingTask.id);
    if (!latest) return;

    const changed =
      latest.title !== editingTask.title ||
      latest.description !== editingTask.description ||
      latest.completed !== editingTask.completed ||
      latest.photoUri !== editingTask.photoUri ||
      latest.locationName !== editingTask.locationName;

    if (changed) {
      handleEdit(latest);
    }
  }, [tasks, editingTask, handleEdit]);

  const summaryText = useMemo(() => {
    if (!totalTasks) {
      return '¡Bienvenido! Comienza agregando tu primera tarea.';
    }

    if (!pendingCount) {
      return '🎉 ¡Excelente trabajo! No quedan tareas pendientes.';
    }

    return `Tienes ${pendingCount} tarea${
      pendingCount === 1 ? '' : 's'
    } pendiente${pendingCount === 1 ? '' : 's'} de ${totalTasks}.`;
  }, [pendingCount, totalTasks]);

  /* ===============================
     ⏳ LOADING REAL (YA NO SE QUEDA)
     =============================== */
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-base text-slate-600">
          Cargando tus tareas…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-5 pt-6">
          <View className="mx-auto w-full max-w-xl flex-1">
            <TaskList
              tasks={filteredTasks}
              onToggleCompleted={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              ListHeaderComponent={
                <View>
                  <View className="mb-5 flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm">
                    <View>
                      <Text className="text-xs uppercase text-slate-500">
                        Sesión activa
                      </Text>
                      <Text className="text-lg font-bold">
                        {user?.email}
                      </Text>
                    </View>
                    <Pressable
                      onPress={signOut}
                      className="rounded-xl border px-4 py-2"
                    >
                      <Text>Cerrar sesión</Text>
                    </Pressable>
                  </View>

                  <Text className="mb-2 text-center text-4xl font-bold">
                    📝 Lista de Tareas
                  </Text>

                  <Text className="mb-5 text-center text-slate-600">
                    {summaryText}
                  </Text>

                  <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />

                  <TaskForm
                    ref={formRef}
                    title={title}
                    description={description}
                    photoUri={photoUri || null}
                    locationName={locationName}
                    isEditing={!!editingTask}
                    onChangeTitle={setTitle}
                    onChangeDescription={setDescription}
                    onChangeLocationName={setLocationName}
                    onSubmit={handleSubmit}
                    onCancelEdit={resetForm}
                    onCapturePhoto={handleCapturePhoto}
                    onRemovePhoto={handleRemovePhoto}
                    onDetectLocation={handleDetectLocation}
                    isCapturingPhoto={isCapturingPhoto}
                    isDetectingLocation={isDetectingLocation}
                    isSaving={isProcessingTask}
                    error={formError}
                  />

                  <TaskStatsBanner
                    total={totalTasks}
                    pending={pendingCount}
                    completed={completedCount}
                  />

                  <TaskFilterSegment
                    value={filter}
                    onChange={setFilter}
                    counts={{
                      total: totalTasks,
                      pending: pendingCount,
                      completed: completedCount,
                    }}
                  />
                </View>
              }
              ListFooterComponent={
                completedCount > 0 ? (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <Pressable
                      onPress={handleClearCompleted}
                      className="mt-4 items-center rounded-lg border-2 border-red-300 bg-red-50 py-2.5"
                    >
                      <Text className="font-bold text-red-600">
                        🗑️ Eliminar tareas completadas ({completedCount})
                      </Text>
                    </Pressable>
                  </Animated.View>
                ) : null
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
