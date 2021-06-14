import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@lib/base/modules';
import { CategoryEntity } from '@lib/entities';
import { CategoriesPublicService, CategoriesRepository } from '@lib/services';
import { CategoriesController } from './controllers';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoriesRepository, CategoriesPublicService],
  exports: [CategoriesRepository, CategoriesPublicService],
  controllers: [CategoriesController],
})
export class CatalogsModule {}
