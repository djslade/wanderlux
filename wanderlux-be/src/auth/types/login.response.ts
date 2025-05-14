import { User } from '@prisma/client';
import { IBaseResponse } from 'src/common/types/base.response';

export interface ILoginResponse extends IBaseResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
