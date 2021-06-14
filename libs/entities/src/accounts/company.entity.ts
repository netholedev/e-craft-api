import { Entity, Column, TreeChildren, TreeParent, Tree } from 'typeorm';
import { BaseUuidEntity } from '@lib/base/abstract/typeorm';

@Entity({
  name: 'companies',
})
@Tree('nested-set')
export class CompanyEntity extends BaseUuidEntity {
  @Column({ nullable: false })
  name: string;

  @TreeChildren()
  children: CompanyEntity[];

  @TreeParent()
  parent: CompanyEntity;
}
