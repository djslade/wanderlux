import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrismaService } from '../../prisma/tests/__mocks__/prisma.service.mock';
import {
  hashedPassword,
  notFoundEmail,
  takenEmail,
  validEmail,
} from './__mocks__/user.testdata';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException } from '@nestjs/common';

describe('User Service', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create', () => {
    it('creates user', async () => {
      const user = await service.create(validEmail, hashedPassword);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email: validEmail, hashedPassword },
        select: { id: true, email: true },
      });
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.hashedPassword).not.toBeDefined();
    });

    it('throws error if email is taken', async () => {
      await expect(service.create(takenEmail, hashedPassword)).rejects.toThrow(
        PrismaClientKnownRequestError,
      );
    });
  });

  describe('findByEmail', () => {
    it('returns a user', async () => {
      const user = await service.findByEmail(validEmail);
      expect(user.email).toBe(validEmail);
      expect(user.hashedPassword).not.toBeDefined();
    });

    it('throws error if email is not found', async () => {
      await expect(service.findByEmail(notFoundEmail)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns hashedPassword when given optional argument', async () => {
      const user = await service.findByEmail(validEmail, true);
      expect(user.hashedPassword).toBeDefined();
    });
  });
});
