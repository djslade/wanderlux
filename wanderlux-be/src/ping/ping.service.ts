import { Injectable } from '@nestjs/common';
import { IGetPingResponse } from './types/getPing.response';

@Injectable()
export class PingService {
  getPing(): IGetPingResponse {
    return { message: 'pong' };
  }
}
