import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { HeapdumpReference } from './instance/heapdump/entities/HeapdumpReference';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [HeapdumpReference],
  migrations: [],
  subscribers: [],
});
