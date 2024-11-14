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

@Entity()
export class HolidaysEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  sheet_id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  month_name: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  holidays: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
