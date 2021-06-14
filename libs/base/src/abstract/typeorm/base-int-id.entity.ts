import { IsInt, IsOptional } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

export class BaseIntIdEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @IsInt()
  id!: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt!: Date;

  /*
  user: ???
  */
}
