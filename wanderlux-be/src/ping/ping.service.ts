import { Injectable } from '@nestjs/common';
import { IGetPingResponse } from './types/getPingResponse';

@Injectable()
export class PingService {
  getPing(): IGetPingResponse {
    return { message: 'pong' };
  }
}
