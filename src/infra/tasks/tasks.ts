import { taskService } from './taskService';
import { configurationService } from '../configuration/configurationService';
import log from 'electron-log';
import { metricsService } from '../metrics/metricsService';
import { instanceInfoService } from '../instance/InstanceInfoService';

taskService.declareTask({
  name: 'queryInstanceMetrics',
  alias: 'Query Instance Metrics',
  description: 'Query the actuator API for instance metrics',
  defaultCron: '* * * * * *',
  function: async () => {
    const instances = configurationService.getInstancesForDataCollection();
    await Promise.all(
      instances.map(async (instance) => {
        log.info(`Querying metrics for instance ${instance.id}`);
        await metricsService.getAndSaveMetrics(instance);
      })
    );
  },
});

taskService.declareTask({
  name: 'queryInstanceHealth',
  alias: 'Query Instance Health',
  description: 'Query the actuator API for instance health',
  defaultCron: '* * * * *',
  runOnStartup: true,
  function: async () => {
    const instances = configurationService.getInstances();
    await Promise.all(
      instances.map(async (instance) => {
        log.info(`Querying health for instance ${instance.id}`);
        await instanceInfoService.fetchInstanceHealth(instance);
      })
    );
  },
});

taskService.declareTask({
  name: 'queryInstanceEndpoints',
  alias: 'Query Instance Endpoints',
  description: 'Query the actuator API for instance endpoints',
  defaultCron: '* * * * *',
  runOnStartup: true,
  function: async () => {
    const instances = configurationService.getInstances();
    await Promise.all(
      instances.map(async (instance) => {
        log.info(`Querying endpoints for instance ${instance.id}`);
        await instanceInfoService.fetchInstanceEndpoints(instance);
      })
    );
  },
});
