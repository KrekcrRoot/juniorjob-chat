import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @Column()
  email: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  hashedRefreshToken: string;
}
