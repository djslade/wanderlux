import { Controller, Post } from '@nestjs/common';
import { CredentialsDto } from './dtos/credentials.dto';
import { ISignupResponse } from './types/signup.response';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(credentialsDto: CredentialsDto): ISignupResponse {
    return { message: 'User created' };
  }
}
