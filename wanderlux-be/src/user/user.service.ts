import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(email: string, hashedPassword: string): Promise<User> {
    return await this.prismaService.user.create({
      data: { email, hashedPassword },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
