import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentsDateEntity } from './agentsdata.entity';

@Entity()
export class ApplicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  workingHours: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  offDays: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  daysOfMonth: Array<{
    id: number;
    isWorkDay: boolean;
    isOrder: boolean;
    isNight: boolean;
    isHoliday: boolean;
    isToday: boolean;
    isCheckable: boolean;
    label: number;
  }>;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  supervizorName: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  requested_date: string;
  @ManyToOne(() => AgentsDateEntity, (agent) => agent.applications, {
    onDelete: 'CASCADE',
  })
  agent_id: AgentsDateEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_data: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
