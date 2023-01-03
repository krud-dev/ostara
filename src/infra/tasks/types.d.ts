import {
  Application,
  Configuration,
  EnrichedApplication,
  EnrichedFolder,
  EnrichedInstance,
  EnrichedItem,
  Folder,
  Instance,
} from '../configuration/model/configuration';

export type TaskName = 'queryInstanceMetrics' | 'queryInstanceHealth';

export type TaskDefinition = {
  alias: string;
  name: TaskName;
  description: string;
  defaultCron: string;
  function: () => Promise<void>;
};

export type EffectiveTaskDefinition = TaskDefinition & {
  cron: string;
  active: boolean;
};

export type TaskDefinitionDisplay = Omit<EffectiveTaskDefinition, 'function'> & {
  nextRun: number;
};

declare global {
  export type TaskServiceBridge = {
    getTasksForDisplay: () => Promise<TaskDefinitionDisplay[]>;
    getTaskForDisplay: (name: string) => Promise<TaskDefinitionDisplay | undefined>;
  };

  interface Window {
    task: TaskServiceBridge;
  }
}

export {};
