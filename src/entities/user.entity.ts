import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    name: 'email_address',
    nullable: false,
  })
  email: string;

  @Column({
    default: 0,
  })
  victories: number;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    default: 0,
  })
  attempt: number;

  @Column({
    default: 0,
  })
  match: number;
}
