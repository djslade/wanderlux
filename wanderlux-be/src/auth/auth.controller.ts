import {
  Body,
  Controller,
  Get,
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
import { AuthGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { LoginEmailDto } from './dtos/login-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login/email')
  async loginEmail(@Body() body: LoginEmailDto) {
    const accessToken = await this.authService.signAccessToken(req.user.id);
    const refreshToken = await this.authService.signRefreshToken(req.user.id);
    return {
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserInfo(@Request() req) {
    console.log(typeof req.user.created);
    return { message: 'Identity confirmed', user: req.user };
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Request() req) {
    const accessToken = await this.authService.signAccessToken(req.user.id);
    await this.authService.revokeRefreshToken(req.refreshToken);
    const newRefreshToken = await this.authService.signRefreshToken(
      req.user.id,
    );
    return {
      message: 'Refresh successful',
      accessToken,
      refreshToken: newRefreshToken.id,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(RefreshGuard)
  async revoke(@Request() req) {
    await this.authService.revokeRefreshToken(req.refeshToken);
    return { message: 'Logout successful' };
  }
}
