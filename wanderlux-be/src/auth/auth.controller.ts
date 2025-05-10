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
    const { email, password } = credentialsDto;
    const hashedPassword = await this.authService.hashPassword(password);
    const user = await this.authService.createUser(email, hashedPassword);
    return { message: 'User created' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto): Promise<ILoginResponse> {
    const { email, password } = credentialsDto;
    const user = await this.authService.authenticateUser(email, password);
    const token = await this.authService.signAccessToken(user.id);
    return { message: 'Login succesful', token };
  }
}
