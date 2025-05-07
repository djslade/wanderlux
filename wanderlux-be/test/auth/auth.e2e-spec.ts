import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { PrismaClientExceptionFilter } from '../../src/prisma/filters/prisma-exception.filter';
import { WanderLuxValidationPipe } from '../../src/common/pipes/wanderlux-validation.pipe';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

describe('Auth e2e', () => {
  let app: INestApplication;

  const mockedPrismaService = {
    user: {
      create: jest
        .fn()
        .mockImplementation(({ data: { email, hashedPassword } }) => {
          if (email == 'used@email.com') {
            throw new PrismaClientKnownRequestError('', {
              code: 'P2002',
              clientVersion: '',
              meta: { modelName: 'User', target: ['email'] },
            });
          }
          return { id: '', email, hashedPassword } as User;
        }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockedPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new WanderLuxValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('signup', () => {
    it('creates user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'example@email.com', password: 'strongPASSWORD123!' })
        .expect(HttpStatus.CREATED)
        .expect({ message: 'User created' });
    });

    it('handles invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'email', password: 'strongPASSWORD123!' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ code: 400, message: 'Email has an invalid format' });
    });

    it('handles email already in use', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'used@email.com', password: 'strongPASSWORD123!' })
        .expect(HttpStatus.CONFLICT)
        .expect({
          message: 'An account with this email address already exists',
        });
    });

    it('handles invalid password #1', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'example@email.com', password: 'strong' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ code: 400, message: 'Password is not strong enough' });
    });

    it('handles invalid password #2', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'example@email.com', password: 'password' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ code: 400, message: 'Password is not strong enough' });
    });

    it('handles invalid password #3', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'example@email.com', password: 'strongPASSWORD' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ code: 400, message: 'Password is not strong enough' });
    });

    it('handles invalid password #4', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'example@email.com', password: 'strongPASSWORD123' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ code: 400, message: 'Password is not strong enough' });
    });
  });
});
