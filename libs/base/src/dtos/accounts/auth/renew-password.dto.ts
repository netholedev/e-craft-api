import { IsEmail, IsString } from 'class-validator';

export class RenewPasswordDto {
  @IsString()
  code: string;

  @IsString()
  password: string;
}
