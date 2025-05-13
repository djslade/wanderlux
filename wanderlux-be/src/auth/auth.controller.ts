import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { ISignupResponse } from './types/signup.response';
import { AuthService } from './auth.service';
import { ILoginResponse } from './types/login.response';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authRequest: AuthRequestDto): Promise<ISignupResponse> {
    const user = await this.authService.handleSignupRequest(authRequest);
    return { message: 'User created', userId: user.id };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  async login(@Request() req): Promise<ILoginResponse> {
    const accessToken = await this.authService.signAccessToken(req.user.id);
    const refreshToken = await this.authService.signRefreshToken(req.user.id);
    return {
      message: 'Login succesful',
      userId: req.user.id,
      accessToken,
      refreshToken: refreshToken.id,
    };
  }
}
