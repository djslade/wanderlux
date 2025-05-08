import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from '../ping.service';

describe('Ping Service', () => {
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingService],
    }).compile();

    service = module.get<PingService>(PingService);
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getPing', () => {
    it('pongs', () => {
      expect(service.getPing().message).toBe('pong');
    });
  });
});
