import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { CredentialsDto } from '../dtos/credentials.dto';

// test data
const validCredentials: CredentialsDto = {
  email: 'example@email.com',
  password: 'password124',
};

const successMessage: string = 'User created';

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
      const credentials: CredentialsDto = validCredentials;

      expect(controller.signup(credentials)).toBeDefined();
    });

    it('should return a response with a message field', async () => {
      const credentials: CredentialsDto = validCredentials;

      const message = (await controller.signup(credentials)).message;
      expect(message).toBeDefined();
    });

    it('should return a specific message on success', async () => {
      const credentials: CredentialsDto = validCredentials;

      const expectedMessage: string = successMessage;

      const message = (await controller.signup(credentials)).message;

      expect(message).toBe(expectedMessage);
    });
  });
});
