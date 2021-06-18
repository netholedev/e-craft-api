import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseUuidEntity } from '@lib/base/abstract/typeorm';
import { CompanyEntity } from './company.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseUuidEntity {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ select: false, nullable: true })
  code?: string;

  @Column({ select: false, nullable: true })
  expire?: Date;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken?: string;

  @Column({ select: false, name: 'is_super_admin', type: 'bool', default: false })
  isSuperAdmin: boolean;

  @OneToOne(() => RoleEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(() => CompanyEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
