import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { ISignupResponse } from './types/signup.response';
import { AuthService } from './auth.service';
import { ILoginResponse } from './types/login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authRequest: AuthRequestDto): Promise<ISignupResponse> {
    const userId = await this.authService.handleSignupRequest(authRequest);
    return { message: 'User created', userId };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authRequest: AuthRequestDto): Promise<ILoginResponse> {
    const userId = await this.authService.authenticateLoginRequest(authRequest);
    const token = await this.authService.signAccessToken(userId);
    return { message: 'Login succesful', userId, token };
  }
}
