import { Instance } from '../configuration/model/configuration';
import { ActuatorClient } from '../actuator/actuatorClient';
import log from 'electron-log';
import { ApplicationMetricValue } from '../entity/ApplicationMetricValue';
import { dataSource } from '../dataSource';
import { ApplicationMetric } from '../entity/ApplicationMetric';

class MetricsService {
  async getOrCreateApplicationMetric(applicationId: string, name: string, description?: string, unit?: string) {
    const repository = dataSource.getRepository(ApplicationMetric);
    const applicationMetric = await repository.findOneBy({
      applicationId,
      metric: name,
    });
    if (applicationMetric) {
      return applicationMetric;
    }
    const newApplicationMetric = new ApplicationMetric();
    newApplicationMetric.metric = name;
    newApplicationMetric.description = description;
    newApplicationMetric.unit = unit;
    newApplicationMetric.applicationId = applicationId;
    return repository.save(newApplicationMetric);
  }

  async getAndSaveMetrics(instance: Instance) {
    log.info(`Querying metrics for instance ${instance.id}`);
    const client = new ActuatorClient(instance.actuatorUrl);
    const { names } = await client.metrics();
    log.debug(`Metrics for instance ${instance.id} retrieved`);
    await Promise.all(
      names.map(async (name) => {
        const metricResponse = await client.metric(name, {});
        log.debug(`Metric ${metricResponse.name} for instance ${instance.id} retrieved`);
        const applicationMetric = await this.getOrCreateApplicationMetric(
          instance.parentApplicationId,
          metricResponse.name,
          metricResponse.description,
          metricResponse.baseUnit
        );

        await Promise.all(
          metricResponse.measurements.map((measurement) => {
            const applicationMetricValue = new ApplicationMetricValue();
            applicationMetricValue.applicationMetric = applicationMetric;
            applicationMetricValue.instanceId = instance.id;
            applicationMetricValue.value = measurement.value;
            applicationMetricValue.timestamp = new Date();
            return dataSource.getRepository(ApplicationMetricValue).save(applicationMetricValue);
          })
        );
      })
    );
  }
}

export const metricsService = new MetricsService();
