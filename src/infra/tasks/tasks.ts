import { taskService } from './taskService';
import { configurationService } from '../configuration/configurationService';
import log from 'electron-log';
import { instanceService } from '../instance/instanceService';
import { instanceAbilityService } from '../instance/InstanceAbilityService';
import { instanceHeapdumpService } from '../instance/heapdump/instanceHeapdumpService';

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

taskService.declareTask({
  name: 'downloadPendingHeapdumpReferences',
  alias: 'Download Pending Heapdump References',
  description: 'Download pending heapdump references',
  defaultCron: '*/5  * * * * *',
  function: async () => {
    log.info('Downloading pending heapdump references');
    await instanceHeapdumpService.downloadPendingReferences();
  },
});
