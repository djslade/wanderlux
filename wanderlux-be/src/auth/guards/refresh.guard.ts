import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.prismaService.refreshToken.findFirst({
      where: { id: token, expires: { gt: new Date() } },
    });
    if (refreshToken === null) throw new UnauthorizedException();

    const user = await this.prismaService.user.findUnique({
      where: { id: refreshToken.userId },
    });
    if (user === null) throw new UnauthorizedException();

    request.user = user;
    request.refreshToken = token;

    return true;
  }
}
