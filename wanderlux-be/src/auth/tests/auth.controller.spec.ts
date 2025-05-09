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
    it('executes service method', () => {
      controller.signup({ email: validEmail, password: validPassword });
      expect(mockAuthService.signup).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });
  });

  describe('login', () => {
    it('executes service method', () => {
      controller.login({ email: validEmail, password: validPassword });
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });
  });
});
