import { taskService } from './taskService';
import { configurationService } from '../configuration/configurationService';
import log from 'electron-log';
import { metricsService } from '../metrics/metricsService';

taskService.declareTask({
  name: 'Query Instances Metrics',
  description: 'Query the actuator API for instance metrics',
  defaultCron: '* * * * *',
  function: async () => {
    const instances = configurationService.getInstances();
    await Promise.all(
      instances.map(async (instance) => {
        log.info(`Querying metrics for instance ${instance.id}`);
        await metricsService.getAndSaveMetrics(instance);
      })
    );
  },
});
