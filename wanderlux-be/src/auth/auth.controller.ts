import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CredentialsDto } from './dtos/credentials.dto';
import { ISignupResponse } from './types/signup.response';
import { AuthService } from './auth.service';
import { ILoginResponse } from './types/login.response';

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

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto): Promise<ILoginResponse> {
    const token = await this.authService.login(credentialsDto);
    return { message: 'Login succesful', token };
  }
}
