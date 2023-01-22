import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { HeapdumpReference } from './instance/heapdump/entities/HeapdumpReference';
import path from 'path';
import { app } from 'electron';

const databasePath: string = path.join(app.getPath('userData'), 'database.sqlite');

export const dataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true,
  logging: false,
  entities: [HeapdumpReference],
  migrations: [],
  subscribers: [],
});
