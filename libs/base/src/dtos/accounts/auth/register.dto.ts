import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '@lib/base/decorators';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsString()
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;
}
