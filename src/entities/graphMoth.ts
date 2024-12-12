import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentsDateEntity } from './agentsdata.entity';
import { GraphDaysEntity } from './graphDays';
import { ApplicationEntity } from './applications.entity';

@Entity()
export class GraphMonthEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  year: string;

  @Column({
    type: 'int',
    default: 0,
  })
  month_number: number;

  @Column({
    type: 'character varying',
  })
  month_name: string;

  @Column({
    type: 'character varying',
  })
  month_days_count: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  month_day_off_first: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  month_day_off_second: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  month_work_time: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  month_straight: string;

  @ManyToOne(() => AgentsDateEntity, (agent) => agent.months, {
    onDelete: 'CASCADE',
  })
  agent_id: AgentsDateEntity[];

  @OneToMany(() => GraphDaysEntity, (group) => group.month_id)
  days: GraphDaysEntity[];

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
