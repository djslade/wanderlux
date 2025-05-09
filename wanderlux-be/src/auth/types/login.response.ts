import { IBaseResponse } from 'src/common/types/base.response';

export interface ILoginResponse extends IBaseResponse {
  token: string;
}
