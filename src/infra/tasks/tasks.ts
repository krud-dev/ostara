import { taskService } from './taskService';
import { configurationService } from '../configuration/configurationService';
import log from 'electron-log';
import { metricsService } from '../metrics/metricsService';
import { instanceService } from '../instance/instanceService';
import { instanceAbilityService } from '../instance/InstanceAbilityService';

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
        await instanceService.fetchInstanceHealth(instance);
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
        await instanceAbilityService.fetchInstanceEndpoints(instance.id);
      })
    );
  },
});
