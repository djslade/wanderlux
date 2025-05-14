import * as bcrypt from 'bcrypt';

export const mockBcrypt = () => {
  jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => 'salt');
  jest
    .spyOn(bcrypt, 'hash')
    .mockImplementation(
      async (password: string, salt: string) => password + salt,
    );
  jest
    .spyOn(bcrypt, 'compare')
    .mockImplementation(async (data: string, _: string) => data === '');
};
