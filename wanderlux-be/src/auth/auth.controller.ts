import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsDto } from './dtos/credentials.dto';
import { ISignupResponse } from './types/signup.response';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<ISignupResponse> {
    await this.authService.signup(credentialsDto);
    return { message: 'User created' };
  }
}
