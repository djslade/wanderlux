import { HttpStatus } from '@nestjs/common';
import { PrismaClientExceptionFilter } from '../filters/prisma-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('Prisma Client Exception Filter', () => {
  let filter: PrismaClientExceptionFilter;
  let mockConsoleError: jest.SpyInstance;

  const mockJson = jest.fn();

  const mockResponse = {
    status: jest.fn().mockReturnValue({
      json: mockJson,
    }),
  };

  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: jest.fn().mockReturnValue(mockResponse),
    getRequest: jest.fn(),
  }));

  const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };

  // test data
  const defaultErrorLog = 'An unknown prisma client exception occurred';
  const defaultUserErrorLog =
    "A unique constraint on the User was violated, but there isn't an assigned message for it";
  const defaultUniqueErrorLog = 'An unknown unique constraint was violated';

  beforeEach(async () => {
    filter = new PrismaClientExceptionFilter();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });
  });

  describe('No known code', () => {
    it('logs errors with no code', () => {
      const e = new PrismaClientKnownRequestError('Prisma client error', {
        code: '',
        clientVersion: '',
      });

      filter.catch(e, mockArgumentsHost);
      expect(mockConsoleError).toHaveBeenCalledWith(defaultErrorLog);
      expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
    });

    it('logs errors with unhandled code', () => {
      const e = new PrismaClientKnownRequestError('Prisma client error', {
        code: 'thiscodeisntvalid',
        clientVersion: '',
      });

      filter.catch(e, mockArgumentsHost);
      expect(mockConsoleError).toHaveBeenCalledWith(defaultErrorLog);
      expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
    });
  });

  describe('Unique constraint violations', () => {
    describe('Violations on an unknown model', () => {
      it('logs errors when the model is undefined', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            target: [],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUniqueErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });

      it('logs errors when the model is blank', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: '',
            target: [],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUniqueErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });

      it('logs errors when the model is unhandled', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: 'UnhandledModel',
            target: [],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUniqueErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });
    });

    describe('Violations on User model', () => {
      it('logs errors when the target is undefined', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: 'User',
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUserErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });

      it('logs errors when the target is empty', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: 'User',
            target: [],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUserErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });

      it('logs errors when the target does not contain a valid target', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: 'User',
            target: ['an invalid target'],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).toHaveBeenCalledWith(defaultUserErrorLog);
        expect(mockConsoleError).toHaveBeenCalledWith(e); // logs error
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'A unique constraint was violated',
        });
      });

      it('handles email constraint violation', () => {
        const e = new PrismaClientKnownRequestError('Prisma client error', {
          code: 'P2002',
          clientVersion: '',
          meta: {
            modelName: 'User',
            target: ['email'],
          },
        });
        filter.catch(e, mockArgumentsHost);
        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockJson).toHaveBeenCalledWith({
          message: 'An account with this email address already exists',
        });
      });
    });
  });
});
