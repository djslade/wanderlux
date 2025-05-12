import {
  externalEmail,
  externalUserId,
  localEmail,
  localUserId,
} from 'src/user/tests/__mocks__/user.testdata';

export const mockCredentialsService = {
  create: jest.fn(
    async (userId: number, email: string, hashedPassword: string) => {
      return {
        userId,
        email,
        hashedPassword,
      };
    },
  ),
  findByEmail: jest.fn(async (email: string) =>
    email === localEmail ? localUserId : null,
  ),
  findByEmailExternal: jest.fn(async (email: string) =>
    email === externalEmail ? externalUserId : null,
  ),
};
