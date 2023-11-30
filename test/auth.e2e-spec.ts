import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';

describe('Authentication System (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles signup request', () => {
        const email = 'testPassword003@test.test';
        const password = 'testPassword001';

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({email, password})
            .expect(201)
            .then(res => {
                const {id, email, password} = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
                expect(password).toEqual(password);
            })
    });
});
