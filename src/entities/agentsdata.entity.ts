import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GraphMonthEntity } from './graphMoth';
import { ApplicationEntity } from './applications.entity';

@Entity()
export class AgentsDateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  agent_id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  login: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  service_name: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  first_number: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  secont_number: string;



  @Column({
    type: 'character varying',
    default: 'operator',
    nullable: true,
  })
  role: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  image: string;

  @OneToMany(() => GraphMonthEntity, (group) => group.agent_id)
  months: GraphMonthEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.agent_id)
  applications: ApplicationEntity[];
  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @CreateDateColumn({ name: 'update_at' })
  update_data: Date;
}
