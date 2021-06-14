/* eslint-disable @typescript-eslint/ban-types */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const mappedErrors = errors.map((e: ValidationError) => {
        const keys = Object.keys(e.constraints);
        return keys.map((k: string) => e.constraints[k]);
      });

      throw new BadRequestException(mappedErrors.flat(2));
    }

    // Empty Query Fix
    const objectKeys = Object.keys(object);
    for (const key of objectKeys) {
      const value = object[key];
      if ((Array.isArray(value) && value.length === 0) || (Array.isArray(value) && value[0] === '')) {
        delete object[key];
      }
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
