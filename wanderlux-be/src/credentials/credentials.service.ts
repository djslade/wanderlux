import { Injectable } from '@nestjs/common';
import { ExternalLoginData, LoginData } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CredentialsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    userId: number,
    email: string,
    hashedPassword: string,
  ): Promise<LoginData> {
    return await this.prismaService.loginData.create({
      data: { userId, email, hashedPassword },
    });
  }

  async createExternal(
    userId: number,
    providerName: string,
    providerToken: string,
    email?: string,
  ): Promise<ExternalLoginData> {
    return await this.prismaService.externalLoginData.create({
      data: { userId, providerName, providerToken, email },
    });
  }

  async findByEmail(email: string): Promise<LoginData | null> {
    return await this.prismaService.loginData.findUnique({
      where: { email },
    });
  }

  async findByEmailExternal(email: string): Promise<ExternalLoginData | null> {
    return await this.prismaService.externalLoginData.findFirst({
      where: { email },
    });
  }
}
