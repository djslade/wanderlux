import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CredentialsService } from 'src/credentials/credentials.service';
import { AuthRequestDto } from './dtos/auth-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialsService: CredentialsService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async isEmailAvailable(email: string): Promise<boolean> {
    const loginData = await this.credentialsService.findByEmail(email);
    return loginData === null;
  }

  private async getUserId(email: string): Promise<number> {
    const loginData = await this.credentialsService.findByEmail(email);
    if (loginData) return loginData.userId;
    const external = await this.credentialsService.findByEmailExternal(email);
    if (external) return external.userId;
    const user = await this.userService.create();
    return user.id;
  }

  async handleSignupRequest(authRequest: AuthRequestDto): Promise<number> {
    const { email, password } = authRequest;
    if ((await this.isEmailAvailable(email)) === false) {
      throw new ConflictException('This email is already in use');
    }
    const userId = await this.getUserId(email);
    const hashedPassword = await this.hashPassword(password);
    const loginData = await this.credentialsService.create(
      userId,
      email,
      hashedPassword,
    );
    return loginData.userId;
  }

  async authenticateLoginRequest(authRequest: AuthRequestDto): Promise<number> {
    const { email, password } = authRequest;
    const loginData = await this.credentialsService.findByEmail(email);
    if (!loginData) throw new NotFoundException('Invalid email or password');
    const matches = await bcrypt.compare(password, loginData.hashedPassword);
    if (!matches) throw new NotFoundException('Invalid email or password');
    return loginData.userId;
  }

  async signAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
