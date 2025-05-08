import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { CredentialsDto } from '../dtos/credentials.dto';

describe('Ping Controller', () => {
  let controller: AuthController;
  const mockPingService = {
    signup: jest.fn(),
  };
  const mockCredentialsDto: CredentialsDto = {
    email: 'example@email.com',
    password: 'strongPASSWORD123!',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockPingService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getPing', () => {
    it('executes service method', () => {
      controller.signup(mockCredentialsDto);
      expect(mockPingService.signup).toHaveBeenCalledWith(mockCredentialsDto);
    });
  });
});
