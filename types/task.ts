export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  photoUrl: string;     // 👈 CLAVE
  locationName: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'photoUrl' | 'locationName'
>;
