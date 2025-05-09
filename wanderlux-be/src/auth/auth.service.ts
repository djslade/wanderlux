import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsDto } from './dtos/credentials.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(credentials: CredentialsDto): Promise<void> {
    const { email, password } = credentials;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.userService.create(email, hashedPassword);
  }

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

  async login(credentials: CredentialsDto): Promise<string> {
    const { email, password } = credentials;
    const user = await this.userService.findByEmail(email, true);
    if (user === null) throw new NotFoundException('Invalid email or password');
    if (!user.hashedPassword) {
      console.error('hashedPassword field is missing');
      throw new InternalServerErrorException();
    }
    const matches = await bcrypt.compare(password, user.hashedPassword);
    if (!matches) throw new NotFoundException('Invalid email or password');
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async getUserData(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user === null) throw new NotFoundException('Invalid email or password');
    return user;
  }

  async validateUserPassword(password: string, hashedPassword: string) {
    const matches = await bcrypt.compare(password, hashedPassword);
    if (!matches) throw new NotFoundException('Invalid email or password');
  }

  async signAccessToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
