import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HeapdumpReference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instanceId!: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  size?: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: number;

  @Column({ default: 'pending' })
  status!: 'pending' | 'downloading' | 'ready' | 'error';

  @Column({ nullable: true })
  statusMessage!: string;
}
