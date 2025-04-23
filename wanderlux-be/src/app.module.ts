import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PingModule } from './ping/ping.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PingModule, AuthModule],
})
export class AppModule {}
