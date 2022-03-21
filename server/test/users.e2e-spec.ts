import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from '../src/users/entities/verification.entity';

const GRAPHQL_ENDPOINT = '/graphql';
const EMAIL = 'yurikbvv@gmail.com';
const PASSWORD = 'yurikbvv@gmail.com';

/*jest.mock('fetch', () => ({
  post: jest.fn(),
}));*/

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('x-jwt', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('createAccount', () => {
    it('should create account', function () {
      return publicTest(`mutation {
                  createAccount(input: {
                    email: "${EMAIL}",
                    password: "${PASSWORD}",
                    role: Delivery
                  }) {
                    ok
                    error
                  }
                }`)
        .expect(200)
        .expect((res) => {
          expect(res?.body?.data?.createAccount?.ok).toBe(true);
          expect(res?.body?.data?.createAccount?.error).toBe(null);
        });
    });

    it('should fail if account already exists', function () {
      return publicTest(`mutation {
                  createAccount(input: {
                    email: "${EMAIL}",
                    password: "${PASSWORD}",
                    role: Delivery
                  }) {
                    ok
                    error
                  }
                }`)
        .expect(200)
        .expect((res) => {
          expect(res?.body?.data?.createAccount?.ok).toBe(false);
          expect(res?.body?.data?.createAccount?.error).toBe(
            'There is a user with that email already',
          );
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            login(input: {
              email: "${EMAIL}",
              password: "${PASSWORD}"
            }) {
              ok
              token
              error
            }}
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });

    it('should not be able to login with wrong credentials', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            login(input: {
              email: "${EMAIL}",
              password: "12221212112"
            }) {
              ok
              token
              error
            }}
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Password is wrong');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it('should see a user profile', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `{
          userProfile(userId: ${userId}) {
            ok
            error
            user {
              id
            }
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it('should not find a user profile', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `{
          userProfile(userId: 24) {
            ok
            error
            user {
              id
            }
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('User not found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should login', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `{
          me {
            email
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(EMAIL);
        });
    });

    it('should not allow to logged out user', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
          me {
            email
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    it('should change email', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `mutation {
          editProfile(input: {
            email: "yurikbv@ya.ru"
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should have a new email', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `{
          me {
            email
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe('yurikbv@ya.ru');
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });

    it('should verify email', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
          verifyEmail(input: {
            code: "${verificationCode}"
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should fail on wrong verification code', function () {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
          verifyEmail(input: {
            code: "1234234324"
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('Verification code not found');
        });
    });
  });
});
