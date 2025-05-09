import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { mockUserService } from '../../user/tests/__mocks__/user.service.mock';
import { UserService } from '../../user/user.service';
import {
  mismatchPassword,
  notFoundEmail,
  validEmail,
  validPassword,
} from '../../user/tests/__mocks__/user.testdata';
import { mockBcrypt } from './__mocks__/bcrypt.mock';
import { NotFoundException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    mockBcrypt();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('signup', () => {
    it('executes service method', async () => {
      await service.signup({
        email: validEmail,
        password: validPassword,
      });
      expect(mockUserService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns token', async () => {
      const token: string = await service.login({
        email: validEmail,
        password: validPassword,
      });
      expect(token).toBeDefined();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        validEmail,
        true,
      );
    });

    it('throws NotFoundException if no user found', async () => {
      await expect(
        service.login({ email: notFoundEmail, password: validPassword }),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        notFoundEmail,
        true,
      );
    });

    it('throws NotFoundException on mismatched password', async () => {
      await expect(
        service.login({ email: validEmail, password: mismatchPassword }),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        validEmail,
        true,
      );
    });
  });
});
