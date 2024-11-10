import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
