import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'word_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  value: string;

  @Column({
    default: false,
  })
  selected: boolean;

  @Column({
    default: 0,
  })
  won: number;

  @Column({
    default: false,
  })
  current: boolean;
}
