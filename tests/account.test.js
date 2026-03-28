const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');
const Account = require('../models/account/Account');

describe('Account API Tests', () => {
    before(async () => {
        // Wait for mongoose connection
        if (mongoose.connection.readyState === 0) {
            await new Promise((resolve) => {
                mongoose.connection.once('open', resolve);
            });
        }
    });

    beforeEach(async () => {
        // Clear database before each test
        await Account.deleteMany({});
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('POST /account/create', () => {
        it('should create a new account with valid data', async () => {
            const accountData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const res = await request(app)
                .post('/account/create')
                .send(accountData)
                .expect(200);

            expect(res.body.user).to.have.property('name', 'John Doe');
            expect(res.body.user).to.have.property('email', 'john@example.com');
            expect(res.body.user).to.have.property('age', 30);

            const accounts = await Account.find();
            expect(accounts).to.have.lengthOf(1);
        });

        it('should return error if email is missing', async () => {
            const res = await request(app)
                .post('/account/create')
                .send({ name: 'John Doe', age: 30 })
                .expect(500);

            expect(res.body).to.have.property('error');
        });

        it('should create account without optional fields', async () => {
            const res = await request(app)
                .post('/account/create')
                .send({ email: 'minimal@example.com' })
                .expect(200);

            expect(res.body.user).to.have.property('email', 'minimal@example.com');
        });
    });

    describe('GET /account/fetch', () => {
        it('should return all accounts', async () => {
            await Account.create([
                { email: 'user1@example.com', name: 'User 1', age: 25 },
                { email: 'user2@example.com', name: 'User 2', age: 30 }
            ]);

            const res = await request(app)
                .get('/account/fetch')
                .expect(200);

            expect(res.body.users).to.have.lengthOf(2);
        });

        it('should return empty array if no accounts exist', async () => {
            const res = await request(app)
                .get('/account/fetch')
                .expect(200);

            expect(res.body.users).to.have.lengthOf(0);
        });
    });
});
