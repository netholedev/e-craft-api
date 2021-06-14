import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { BaseIntIdEntity } from '@lib/base/abstract/typeorm';
import { CategoryEntity } from './category.entity';

@Entity({
  name: 'products',
})
export class ProductEntity extends BaseIntIdEntity {
  @Column({ nullable: false })
  name: string;

  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  ean13: string;

  @ManyToMany(() => CategoryEntity, { eager: true })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];
}
