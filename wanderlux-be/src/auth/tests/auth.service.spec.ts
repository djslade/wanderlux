import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { mockUserService } from '../../user/tests/__mocks__/user.service.mock';
import { UserService } from '../../user/user.service';
import {
  externalEmail,
  externalUserId,
  localEmail,
  newUserId,
  validEmail,
  validPassword,
} from '../../user/tests/__mocks__/user.testdata';
import { mockBcrypt } from './__mocks__/bcrypt.mock';
import { CredentialsService } from 'src/credentials/credentials.service';
import { mockCredentialsService } from 'src/credentials/tests/__mocks__/credentials.service.mock';
import { ConflictException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    mockBcrypt();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: CredentialsService, useValue: mockCredentialsService },
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

  describe('handleSignupRequest', () => {
    it('executes service method', async () => {
      const actual = await service.handleSignupRequest({
        email: validEmail,
        password: validPassword,
      });
      expect(actual).toBe(newUserId);
      expect(mockUserService.create).toHaveBeenCalled();
      expect(mockCredentialsService.create).toHaveBeenCalled();
    });

    it('throws if email is unavailable', async () => {
      expect(
        await service.handleSignupRequest({
          email: localEmail,
          password: validPassword,
        }),
      ).rejects.toThrow(ConflictException);
      expect(mockUserService.create).not.toHaveBeenCalled();
      expect(mockCredentialsService.create).not.toHaveBeenCalled();
    });

    it('does not create a new user if an existing one is found', async () => {
      const actual = await service.handleSignupRequest({
        email: externalEmail,
        password: validPassword,
      });
      expect(actual).toBe(externalUserId);
      expect(mockUserService.create).not.toHaveBeenCalled();
      expect(mockCredentialsService.create).toHaveBeenCalled();
    });
  });
});
