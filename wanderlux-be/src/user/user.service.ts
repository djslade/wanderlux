import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './types/user';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(email: string, hashedPassword: string): Promise<User> {
    return await this.prismaService.user.create({
      data: { email, hashedPassword },
      select: { id: true, email: true },
    });
  }

  async findByEmail(email: string, returnPassword: boolean = false) {
    const user: User | null = await this.prismaService.user.findUnique({
      select: { id: true, email: true, hashedPassword: returnPassword },
      where: { email },
    });
    if (user == null) throw new NotFoundException('Invalid email or password');
    return user;
  }
}
