import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { api } from '@/services/api';
import { Task, TaskDraft } from '@/types/task';

type Filter = 'all' | 'pending' | 'completed';

interface TasksResponse {
  success: boolean;
  data: Task[];
  count: number;
}

interface TaskResponse {
  success: boolean;
  data: Task;
}

interface TasksContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;

  addTask(task: TaskDraft): Promise<boolean>;
  updateTask(id: string, task: TaskDraft): Promise<boolean>;
  toggleTask(id: string): Promise<void>;
  removeTask(id: string): Promise<void>;
  clearCompleted(): Promise<void>;

  filter: Filter;
  setFilter(value: Filter): void;

  searchQuery: string;
  setSearchQuery(value: string): void;

  pendingCount: number;
  completedCount: number;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 Cargar todos
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await api<TasksResponse>('/todos');
        setTasks(res.data);
      } catch (error) {
        console.error('Error cargando tareas:', error);
        Alert.alert('Error', 'No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // 🔹 Crear
  const addTask = async (draft: TaskDraft) => {
    try {
      const res = await api<TaskResponse>('/todos', {
        method: 'POST',
        body: draft,
      });

      setTasks((prev) => [res.data, ...prev]);
      return true;
    } catch {
      Alert.alert('Error', 'No se pudo crear la tarea');
      return false;
    }
  };

  // 🔹 Actualizar
  const updateTask = async (id: string, draft: TaskDraft) => {
    try {
      const res = await api<TaskResponse>(`/todos/${id}`, {
        method: 'PUT',
        body: draft,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.data : t)),
      );

      return true;
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
      return false;
    }
  };

  // 🔹 Toggle
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const res = await api<TaskResponse>(`/todos/${id}`, {
        method: 'PATCH',
        body: { completed: !task.completed },
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.data : t)),
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  // 🔹 Eliminar
  const removeTask = async (id: string) => {
    try {
      await api(`/todos/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la tarea');
    }
  };

  // 🔹 Limpiar completadas
  const clearCompleted = async () => {
    const completed = tasks.filter((t) => t.completed);
    await Promise.all(completed.map((t) => removeTask(t.id)));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'pending' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;

      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <TasksContext.Provider
      value={{
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
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de TasksProvider');
  }
  return context;
}
