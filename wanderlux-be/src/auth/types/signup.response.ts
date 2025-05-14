import { User } from '@prisma/client';
import { IBaseResponse } from 'src/common/types/base.response';

export interface ISignupResponse extends IBaseResponse {
  user: User;
}
