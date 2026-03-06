import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const authHeader = { 'x-role': 'FINANCE_MANAGER' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /auth/login returns 401 for invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'bad@test.com', password: 'wrong' })
      .expect(401);
  });

  it('POST /finance/init-demo creates ledger and accounts', async () => {
    const res = await request(app.getHttpServer())
      .post('/finance/init-demo')
      .set(authHeader)
      .expect(201);
    expect(res.body.ledger).toBeDefined();
    expect(res.body.accounts).toBeDefined();
    expect(Array.isArray(res.body.accounts)).toBe(true);
  });

  it('GET /finance/ledgers returns array', async () => {
    const res = await request(app.getHttpServer())
      .get('/finance/ledgers')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
