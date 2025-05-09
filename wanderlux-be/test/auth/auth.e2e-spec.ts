import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { PrismaClientExceptionFilter } from '../../src/prisma/filters/prisma-exception.filter';
import { WanderLuxValidationPipe } from '../../src/common/pipes/wanderlux-validation.pipe';
import { mockPrismaService } from '../../src/prisma/tests/__mocks__/prisma.service.mock';
import {
  invalidEmail,
  takenEmail,
  validEmail,
  validPassword,
} from '../../src/user/tests/__mocks__/user.testdata';

jest.mock('bcrypt', () => {
  const genSalt = async () => 'salt';
  const hash = async (password: string, salt: string) => password + salt;
  return { genSalt, hash };
});

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new WanderLuxValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('signup', () => {
    it('creates user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: validEmail, password: validPassword })
        .expect(HttpStatus.CREATED)
        .expect({ message: 'User created' });
    });

    it('handles invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: invalidEmail, password: validPassword })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          code: HttpStatus.BAD_REQUEST,
          message: 'Email has an invalid format',
        });
    });

    it('handles email already in use', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: takenEmail, password: validPassword })
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

  describe('login', () => {
    it('returns a token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: validEmail, password: validPassword })
        .expect(HttpStatus.OK);
    });
  });
});
