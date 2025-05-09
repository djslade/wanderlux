import { Injectable } from '@nestjs/common';
import { CredentialsDto } from './dtos/credentials.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async signup(credentials: CredentialsDto): Promise<void> {
    const { email, password } = credentials;
    const hashedPassword = await this.hashPassword(password);
    await this.userService.create(email, hashedPassword);
  }

  async login(credentials: CredentialsDto): Promise<string> {
    return 'token';
  }
}
