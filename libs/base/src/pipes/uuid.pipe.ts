import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class UuidPipe implements PipeTransform<string> {
  async transform(value: string) {
    const isValid = validate(value);
    if (!isValid) {
      throw new BadRequestException('Invalid ID!');
    }
    return value;
  }
}
