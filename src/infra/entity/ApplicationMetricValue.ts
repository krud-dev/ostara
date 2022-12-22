import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApplicationMetric } from './ApplicationMetric';

@Entity()
export class ApplicationMetricValue {
  @PrimaryColumn()
  timestamp!: Date;

  @PrimaryColumn()
  value!: number;

  @PrimaryColumn()
  instanceId!: string;

  @PrimaryColumn()
  applicationMetricId!: number;

  @ManyToOne('ApplicationMetric', 'applicationMetricValues', { eager: true })
  applicationMetric!: ApplicationMetric;
}
