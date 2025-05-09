import { hashedPassword, notFoundEmail } from './user.testdata';

export const mockUserService = {
  create: jest.fn(),
  findByEmail: jest.fn(async (email: string, returnPassword: string) => {
    if (email === notFoundEmail) return null;
    if (returnPassword) return { id: 'userid', email, hashedPassword };
    return { id: 'userid', email };
  }),
};
