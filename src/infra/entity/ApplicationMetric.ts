import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationMetricValue } from './ApplicationMetricValue';

@Entity()
export class ApplicationMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  metric!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  applicationId!: string;

  @Column({ nullable: true })
  unit?: string;

  @OneToMany('ApplicationMetricValue', 'applicationMetric')
  applicationMetricValues!: ApplicationMetricValue[];
}
