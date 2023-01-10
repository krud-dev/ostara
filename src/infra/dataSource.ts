import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
