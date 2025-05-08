import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  hashedPassword,
  takenEmail,
  validEmail,
} from '../../../user/tests/__mocks__/user.testdata';
import { User } from '../../../user/types/user';

export const mockPrismaService = {
  user: {
    create: jest.fn(async ({ data, select }) => {
      if (data.email === takenEmail) {
        throw new PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: '',
          meta: { modelName: 'User', target: ['email'] },
        });
      }
      return {
        id: 'userid',
        email: data.email,
      } as User;
    }),
    findUnique: jest.fn(
      async (args: {
        select: { id: boolean; email: boolean; hashedPassword: boolean };
        where: { email: string };
      }) => {
        if (args.where.email !== validEmail) return null;
        if (!args.select.hashedPassword)
          return { id: 'userid', email: validEmail };
        return {
          id: 'userid',
          email: validEmail,
          hashedPassword: hashedPassword,
        };
      },
    ),
  },
};
