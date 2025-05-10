import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async createUser(email: string, hashedPassword: string) {
    const user = await this.userService.create(email, hashedPassword);
    return {
      id: user.id,
      email: user.email,
    };
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user === null) throw new NotFoundException('Invalid email or password');
    const matches = await bcrypt.compare(password, user.hashedPassword);
    if (!matches) throw new NotFoundException('Invalid email or password');
    return {
      id: user.id,
      email: user.email,
    };
  }

  async signAccessToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
