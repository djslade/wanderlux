import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { CredentialsDto } from '../dtos/credentials.dto';

describe('authService', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('signup', () => {
    it('should return a defined response', () => {
      const credentials: CredentialsDto = {
        email: 'example@email.com',
        password: 'password123',
      };

      expect(controller.signup(credentials)).toBeDefined();
    });

    it('should return a response with a message field', () => {
      const credentials: CredentialsDto = {
        email: 'example@email.com',
        password: 'password124',
      };

      expect(controller.signup(credentials).message).toBeDefined();
    });

    it('should return a specific message on success', () => {
      const credentials: CredentialsDto = {
        email: 'example@email.com',
        password: 'password123',
      };

      const expectedMessage: string = 'User created';

      expect(controller.signup(credentials).message).toBe(expectedMessage);
    });
  });
});
