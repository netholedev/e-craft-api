import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const valueToArray = (value: Array<any> | string) => {
  if (Array.isArray(value) && value.length) return value;

  if (typeof value === 'string') {
    const lastChar = value.charAt(value.length - 1);

    if (lastChar === ',') {
      value = value.substring(0, value.length - 1);
    }

    value = value.split(',');
  }

  return value.length ? value.map((v: string) => v.trim()) : [];
};

export class QueryFilter<T> {
  @IsOptional()
  @Transform(({ value }) => valueToArray(value))
  relations?: (keyof T)[];

  @IsOptional()
  @Transform(({ value }) => valueToArray(value))
  select?: (keyof T)[];
}
