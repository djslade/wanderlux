import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from './dtos/auth-request.dto';
import {
  ExternalLoginData,
  LoginData,
  RefreshToken,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async findLocalDataByEmail(email: string): Promise<LoginData | null> {
    return await this.prismaService.loginData.findUnique({
      where: { email },
    });
  }

  private async findExternalByEmail(
    email: string,
  ): Promise<ExternalLoginData | null> {
    return await this.prismaService.externalLoginData.findFirst({
      where: { email },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async findOrCreateUser(email: string): Promise<User> {
    const externalData = await this.findExternalByEmail(email);
    if (externalData) {
      const user = await this.prismaService.user.findUnique({
        where: { id: externalData.userId },
      });
      if (user) return user;
    }
    const user = await this.prismaService.user.create({ data: {} });
    return user;
  }

  async handleSignupRequest(authRequest: AuthRequestDto): Promise<User> {
    const { email, password } = authRequest;
    if ((await this.findLocalDataByEmail(email)) !== null) {
      throw new ConflictException('This email is already in use');
    }
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.findOrCreateUser(email);
      const hashedPassword = await this.hashPassword(password);
      await this.prismaService.loginData.create({
        data: { userId: user.id, email, hashedPassword },
      });
      return user;
    });
  }

  async authenticateLoginRequest(authRequest: AuthRequestDto): Promise<User> {
    const { email, password } = authRequest;
    const loginData = await this.findLocalDataByEmail(email);
    if (!loginData) throw new NotFoundException('Invalid email or password');
    const matches = await bcrypt.compare(password, loginData.hashedPassword);
    if (!matches) throw new NotFoundException('Invalid email or password');
    const user = await this.prismaService.user.findUnique({
      where: { id: loginData.userId },
    });
    if (!user) {
      console.error('Authentication was successful, but no user was found');
      console.error(loginData);
      throw new NotFoundException('Invalid email or password');
    }
    return user;
  }

  async signRefreshToken(userId: number): Promise<RefreshToken> {
    return await this.prismaService.refreshToken.create({
      data: {
        userId,
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async signAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
