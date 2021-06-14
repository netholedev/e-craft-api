import { IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Entity, Column, TreeChildren, TreeParent, Tree, OneToOne, JoinColumn } from 'typeorm';
import { BaseIntIdEntity } from '@lib/base/abstract/typeorm';
import { CompanyEntity } from '..';
import { Type } from 'class-transformer';

@Entity({
  name: 'categories',
})
@Tree('nested-set')
export class CategoryEntity extends BaseIntIdEntity {
  @Column({ nullable: false })
  @IsString()
  name: string;

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  @IsOptional()
  // @ValidateNested()
  // @Type(() => CategoryEntity)
  parent: CategoryEntity;

  @OneToOne(() => CompanyEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
