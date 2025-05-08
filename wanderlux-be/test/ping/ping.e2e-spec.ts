import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WanderLuxValidationPipe } from '../../src/common/pipes/wanderlux-validation.pipe';
import { PingModule } from '../../src/ping/ping.module';
import { PrismaClientExceptionFilter } from '../../src/prisma/filters/prisma-exception.filter';
import * as request from 'supertest';

describe('Ping e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new WanderLuxValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getPing', () => {
    it('pongs', () => {
      return request(app.getHttpServer())
        .get('/ping')
        .expect(HttpStatus.OK)
        .expect({ message: 'pong' });
    });
  });
});
