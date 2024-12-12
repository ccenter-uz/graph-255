import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AgentsDateEntity } from './agentsdata.entity';
import { group } from 'console';
import { GraphMonthEntity } from './graphMoth';

@Entity()
export class SupervisersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  type: string;

  @Column({
    type: 'character varying',
  })
  login: string;

  @Column({
    type: 'character varying',
  })
  full_name: string;

  @OneToMany(() => AgentsDateEntity, (group) => group.agent_id)
  types: AgentsDateEntity[];

  @OneToMany(() => GraphMonthEntity, (group) => group.agent_id)
  months: GraphMonthEntity[];
}

// type ga qarab superviser berish 
// misol uchun 255 atc barcha smena superviserlari
// agents_date service_name = supervisers type  