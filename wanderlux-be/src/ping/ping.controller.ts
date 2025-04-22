import { Controller, Get } from '@nestjs/common';
import { IGetPingResponse } from './types/getPingResponse';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}
  @Get()
  getPing(): IGetPingResponse {
    return this.pingService.getPing();
  }
}
