import { IBaseResponse } from 'src/common/types/base.response';

export interface ILoginResponse extends IBaseResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}
