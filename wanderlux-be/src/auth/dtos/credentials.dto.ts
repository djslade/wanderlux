import { IsEmail, IsStrongPassword } from 'class-validator';

export class CredentialsDto {
  @IsEmail({}, { message: 'Email has an invalid format' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password is not strong enough',
    },
  )
  password: string;
}
