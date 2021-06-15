import { ApiProperty } from '@nestjs/swagger';

export class MultipleFileDto {
  @ApiProperty({ type: Array, format: 'binary' })
  photo_url: string[];

  @ApiProperty({ example: 'Rom' })
  username: string;

  @ApiProperty({ example: '12345678' })
  password: string;
}
