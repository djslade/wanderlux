import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsDto } from './dtos/credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async signup(credentials: CredentialsDto): Promise<User> {
    const { email, password } = credentials;
    const hashedPassword = await this.hashPassword(password);
    return await this.prismaService.user.create({
      data: { email, hashedPassword },
    });
  }
}
