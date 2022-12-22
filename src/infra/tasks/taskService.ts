import schedule from 'node-schedule';

export type TaskDefinition = {
  name: string;
  description: string;
  defaultCron: string;
  function: () => void;
};

class TaskService {
  private readonly tasks: TaskDefinition[] = [];

  declareTask(task: TaskDefinition) {
    if (this.tasks.some((t) => t.name === task.name)) {
      throw new Error(`Task '${task.name}' already exists`);
    }
    this.tasks.push(task);
  }

  initialize() {
    this.tasks.forEach((task) => {
      schedule.scheduleJob(task.defaultCron, task.function);
    });
  }
}

export const taskService = new TaskService();
