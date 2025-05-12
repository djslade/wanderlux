import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import {
  validEmail,
  validPassword,
} from '../../user/tests/__mocks__/user.testdata';
import { mockAuthService } from './__mocks__/auth.service.mock';

describe('Ping Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('signup', () => {
    it('calls service methods', () => {
      controller.signup({ email: validEmail, password: validPassword });
      expect(mockAuthService.handleSignupRequest).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });
  });

  describe('login', () => {
    it('calls service methods', () => {
      controller.login({ email: validEmail, password: validPassword });
      expect(mockAuthService.authenticateLoginRequest).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
      expect(mockAuthService.signAccessToken).toHaveBeenCalledTimes(1);
    });
  });
});
