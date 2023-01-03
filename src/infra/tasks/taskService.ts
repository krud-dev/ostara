import schedule from 'node-schedule';
import log from 'electron-log';
import { EffectiveTaskDefinition, TaskDefinition, TaskDefinitionDisplay } from './types';

class TaskService {
  private readonly tasks: TaskDefinition[] = [];

  declareTask(task: TaskDefinition) {
    if (this.tasks.some((t) => t.name === task.name)) {
      throw new Error(`Task '${task.name}' already exists`);
    }
    log.info(`Registered task '${task.name}'`);
    this.tasks.push(task);
  }

  getTasks(): EffectiveTaskDefinition[] {
    return this.tasks.map((task) => this.getEffectiveTaskDefinition(task));
  }

  getTask(name: string): EffectiveTaskDefinition | undefined {
    const task = this.getTasks().find((t) => t.name === name);
    if (!task) {
      return undefined;
    }
    return task;
  }

  getTasksForDisplay(): TaskDefinitionDisplay[] {
    return this.tasks.map((task) => this.getTaskDefinitionDisplay(task));
  }

  getTaskForDisplay(name: string): TaskDefinitionDisplay | undefined {
    const task = this.getTask(name);
    if (!task) {
      return undefined;
    }
    return this.getTaskDefinitionDisplay(task);
  }

  initialize() {
    this.tasks.forEach((task) => {
      schedule.scheduleJob(task.name, task.defaultCron, () => {
        const start = Date.now();
        log.debug(`Running task '${task.name}'`);
        task
          .function()
          .catch((error) => {
            log.error(`Error running task '${task.name}'`, error);
          })
          .finally(() => {
            log.debug(`Task '${task.name}' concluded in ${Date.now() - start}ms`);
          });
      });
    });
  }

  private getTaskDefinitionDisplay(task: TaskDefinition): TaskDefinitionDisplay {
    const effectiveTaskDefinition = this.getEffectiveTaskDefinition(task);
    return {
      name: effectiveTaskDefinition.name,
      alias: effectiveTaskDefinition.alias,
      description: effectiveTaskDefinition.description,
      defaultCron: effectiveTaskDefinition.defaultCron,
      cron: effectiveTaskDefinition.cron,
      active: effectiveTaskDefinition.active,
      nextRun: schedule.scheduledJobs[task.name]?.nextInvocation()?.getTime() ?? -1,
    };
  }

  private getEffectiveTaskDefinition(task: TaskDefinition): EffectiveTaskDefinition {
    return {
      ...task,
      cron: task.defaultCron, // todo: get from config
      active: true,
    };
  }
}

export const taskService = new TaskService();
