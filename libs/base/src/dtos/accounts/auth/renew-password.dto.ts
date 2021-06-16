import { IsString } from 'class-validator';

export class RenewPasswordDto {
  @IsString()
  email: string;

  @IsString()
  code: string;

  @IsString()
  password: string;
}
