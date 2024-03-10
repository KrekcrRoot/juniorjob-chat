import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

export class Parent {
  @ApiProperty({
    example: v4(),
    description: 'UUID object',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: new Date(),
    description: 'Time created at object',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Time updated at object',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ApiProperty({
    example: false,
    description: 'Banned marker',
  })
  @Column({ default: false })
  banned: boolean;

  @ApiProperty({
    example: null,
    description: 'Delete marker',
  })
  @DeleteDateColumn()
  deleted: Date;
}
