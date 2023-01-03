import { Instance } from '../configuration/model/configuration';
import { ActuatorClient } from '../actuator/actuatorClient';
import log from 'electron-log';
import { ApplicationMetricValue } from '../entity/ApplicationMetricValue';
import { dataSource } from '../dataSource';
import { ApplicationMetric } from '../entity/ApplicationMetric';
import { Between } from 'typeorm';
import { configurationService } from '../configuration/configurationService';

export type ApplicationMetricDTO = {
  name: string;
  description?: string;
  unit?: string;
  values: ApplicationMetricValueDTO[];
};

export type ApplicationMetricValueDTO = {
  value: number;
  timestamp: Date;
};

export type MetricSubscription = {
  metricName: string;
  instanceId: string;
};

class MetricsService {
  async getMetrics(instanceId: string, metricName: string, from: Date, to: Date): Promise<ApplicationMetricDTO> {
    const valueRepository = dataSource.getRepository(ApplicationMetricValue);
    const applicationMetricValues = await valueRepository.findBy({
      instanceId,
      timestamp: Between(from, to),
      applicationMetric: {
        name: metricName,
      },
    });

    if (applicationMetricValues.length === 0) {
      throw new Error(`No metric ${metricName} for instance ${instanceId}`);
    }

    return {
      name: metricName,
      description: applicationMetricValues[0].applicationMetric.description,
      unit: applicationMetricValues[0].applicationMetric.unit,
      values: applicationMetricValues.map((value) => ({
        value: value.value,
        timestamp: value.timestamp,
      })),
    };
  }

  async getLatestMetric(instanceId: string, metricName: string): Promise<ApplicationMetricDTO> {
    const valueRepository = dataSource.getRepository(ApplicationMetricValue);
    const applicationMetricValue = await valueRepository.findOne({
      where: {
        instanceId,
        applicationMetric: {
          name: metricName,
        },
      },
      order: {
        timestamp: 'DESC',
      },
    });

    if (!applicationMetricValue) {
      throw new Error(`No metric ${metricName} for instance ${instanceId}`);
    }

    return {
      name: metricName,
      description: applicationMetricValue.applicationMetric.description,
      unit: applicationMetricValue.applicationMetric.unit,
      values: [
        {
          value: applicationMetricValue.value,
          timestamp: applicationMetricValue.timestamp,
        },
      ],
    };
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

        await Promise.all(
          metricResponse.measurements.map(async (measurement) => {
            const applicationMetric = await this.getOrCreateApplicationMetric(
              instance.parentApplicationId,
              `${metricResponse.name}[${measurement.statistic}]`,
              metricResponse.description,
              metricResponse.baseUnit
            );
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
    configurationService.updateInstanceLastDataCollectionTime(instance.id);
    log.info(
      `Metrics for instance ${instance.id} saved, next collection in ${instance.dataCollectionIntervalSeconds} seconds`
    );
  }

  async getOrCreateApplicationMetric(applicationId: string, name: string, description?: string, unit?: string) {
    const repository = dataSource.getRepository(ApplicationMetric);
    const applicationMetric = await repository.findOneBy({
      applicationId,
      name: name,
    });
    if (applicationMetric) {
      return applicationMetric;
    }
    const newApplicationMetric = new ApplicationMetric();
    newApplicationMetric.name = name;
    newApplicationMetric.description = description;
    newApplicationMetric.unit = unit;
    newApplicationMetric.applicationId = applicationId;
    return repository.save(newApplicationMetric);
  }
}

export const metricsService = new MetricsService();
