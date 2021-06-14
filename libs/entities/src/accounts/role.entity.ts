import { Entity, Column, Index, JoinTable, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseUuidEntity } from '@lib/base/abstract/typeorm';
import { CompanyEntity } from './company.entity';
import { PermissionEntity } from './permission.entity';

@Entity({
  name: 'roles',
})
export class RoleEntity extends BaseUuidEntity {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ default: false, name: 'is_default' })
  @Index({ where: 'is_default = TRUE', unique: true })
  isDefault: boolean;

  @ManyToMany(() => PermissionEntity, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @OneToOne(() => CompanyEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
