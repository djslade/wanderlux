import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(): Promise<User> {
    return await this.prismaService.user.create({ data: {} });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async setOnboardingFinished(id: number): Promise<User> {
    return await this.prismaService.user.update({
      data: { finishedOnboarding: true },
      where: { id },
    });
  }
}
