export const tasksKeys = {
  tasks: () => ['tasks'],
  task: (name: string) => [...tasksKeys.tasks(), name],
};
