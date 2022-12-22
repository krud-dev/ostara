import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ApplicationMetric } from './entity/ApplicationMetric';
import { ApplicationMetricValue } from './entity/ApplicationMetricValue';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [ApplicationMetric, ApplicationMetricValue],
  migrations: [],
  subscribers: [],
});
