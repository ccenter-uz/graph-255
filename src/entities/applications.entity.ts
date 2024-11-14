import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { AgentsDateEntity } from './agentsdata.entity';

@Entity()
export class ApplicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  workingHours: string;

  @Column({
    type: 'text',
    array: true,
  })
  offDays: string[];

  @Column({
    type: 'character varying',
  })
  full_name: string;

  @Column({
    type: 'jsonb',
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

  @ManyToOne(() => AgentsDateEntity, (agent) => agent.applications, {
    onDelete: 'CASCADE',
  })
  agent_id: AgentsDateEntity[];
}
