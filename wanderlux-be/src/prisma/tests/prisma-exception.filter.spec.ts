import { PrismaClientExceptionFilter } from '../prisma-exception.filter';

describe('prismaClientExceptionFilter', () => {
  let filter: PrismaClientExceptionFilter;

  beforeEach(async () => {
    filter = new PrismaClientExceptionFilter();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });
  });
});
