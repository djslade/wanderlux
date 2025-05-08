import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { mockUserService } from '../../user/tests/__mocks__/user.service.mock';
import { UserService } from '../../user/user.service';
import {
  validEmail,
  validPassword,
} from '../../user/tests/__mocks__/user.testdata';

jest.mock('bcrypt', () => {
  const genSalt = async () => 'salt';
  const hash = async (password: string, salt: string) => password + salt;
  return { genSalt, hash };
});

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
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
});
