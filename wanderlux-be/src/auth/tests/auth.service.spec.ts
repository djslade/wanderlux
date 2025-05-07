import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('Auth Service', () => {
  let service: AuthService;
  let mockPrismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
