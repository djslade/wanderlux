import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from '../ping.service';
import { PingController } from '../ping.controller';
import { mockPingService } from './__mocks__/ping.service.mock';

describe('Ping Controller', () => {
  let controller: PingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [{ provide: PingService, useValue: mockPingService }],
    }).compile();

    controller = module.get<PingController>(PingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getPing', () => {
    it('executes service method', () => {
      controller.getPing();
      expect(mockPingService.getPing).toHaveBeenCalled();
    });
  });
});
