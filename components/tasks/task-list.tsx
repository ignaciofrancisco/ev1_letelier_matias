import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';

import { Task } from '@/types/task';

import { TaskItem } from './task-item';

export type TaskListProps = {
  tasks: Task[];
  onToggleCompleted: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  ListHeaderComponent?: React.ComponentProps<typeof FlatList>['ListHeaderComponent'];
  ListFooterComponent?: React.ComponentProps<typeof FlatList>['ListFooterComponent'];
};

export const TaskList = ({
  tasks,
  onToggleCompleted,
  onEdit,
  onDelete,
  ListHeaderComponent,
  ListFooterComponent,
}: TaskListProps) => {
  const renderItem = ({ item }: ListRenderItemInfo<Task>) => (
    <TaskItem task={item} onToggleCompleted={onToggleCompleted} onEdit={onEdit} onDelete={onDelete} />
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{ gap: 12, paddingBottom: 24, flexGrow: 1 }}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-center text-base font-medium text-slate-500">
            📭 No hay tareas para mostrar
          </Text>
        </View>
      }
    />
  );
};
