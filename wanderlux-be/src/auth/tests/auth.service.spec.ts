import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('bcrypt', () => {
  const genSalt = async () => 'salt';
  const hash = async (password: string, salt: string) => password + salt;
  return { genSalt, hash };
});

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest
          .fn()
          .mockImplementation(({ data: { email, hashedPassword } }) => {
            if (email == 'used@email.com') {
              throw new PrismaClientKnownRequestError('', {
                code: 'P2002',
                clientVersion: '',
                meta: { modelName: 'User', target: ['email'] },
              });
            }
            return {
              id: 'userid',
              email,
              hashedPassword,
              updated: new Date(),
              created: new Date(),
            } as User;
          }),
      },
    };
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

  describe('signup', () => {
    it('returns a new user', async () => {
      const result = await service.signup({
        email: 'example@email.com',
        password: 'strongPASSWORD123!',
      });
      expect(result.id).toBeDefined();
      expect(result.email).toBe('example@email.com');
      expect(result.hashedPassword).toBeDefined();
      expect(result.updated).toBeInstanceOf(Date);
      expect(result.created).toBeInstanceOf(Date);
    });

    it('throws on email conflict', async () => {
      await expect(
        service.signup({
          email: 'used@email.com',
          password: 'strongPASSWORD123!',
        }),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });
  });
});
