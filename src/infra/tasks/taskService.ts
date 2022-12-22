import schedule from 'node-schedule';
import log from 'electron-log';

export type TaskDefinition = {
  name: string;
  description: string;
  defaultCron: string;
  function: () => Promise<void>;
};

class TaskService {
  private readonly tasks: TaskDefinition[] = [];

  declareTask(task: TaskDefinition) {
    if (this.tasks.some((t) => t.name === task.name)) {
      throw new Error(`Task '${task.name}' already exists`);
    }
    log.info(`Registered task '${task.name}'`);
    this.tasks.push(task);
  }

  initialize() {
    this.tasks.forEach((task) => {
      schedule.scheduleJob(task.defaultCron, () => {
        const start = Date.now();
        log.info(`Running task '${task.name}'`);
        task
          .function()
          .catch((error) => {
            log.error(`Error running task '${task.name}'`, error);
          })
          .finally(() => {
            log.info(`Task '${task.name}' concluded in ${Date.now() - start}ms`);
          });
      });
    });
  }
}

export const taskService = new TaskService();
