import { newUserId } from './user.testdata';

export const mockUserService = {
  create: jest.fn(async () => {
    return { id: newUserId };
  }),
};
