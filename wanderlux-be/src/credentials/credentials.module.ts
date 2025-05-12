import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CredentialsService } from './credentials.service';

@Module({
  imports: [PrismaModule],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
