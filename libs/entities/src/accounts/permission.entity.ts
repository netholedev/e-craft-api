import { Entity, Column, Index } from 'typeorm';
import { BaseUuidEntity } from '@lib/base/abstract/typeorm';

@Entity({
  name: 'permissions',
})
@Index(['method', 'path'], { unique: true })
export class PermissionEntity extends BaseUuidEntity {
  @Column({ nullable: false, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] })
  method: string;

  @Column({ nullable: false })
  path: string;
}
