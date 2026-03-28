const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');
const Account = require('../models/account/Account');
const Conversion = require('../models/conversion/Conversion');

describe('Conversion API Tests', () => {
    let testUser;

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
        await Conversion.deleteMany({});
        
        // Create a test user
        testUser = await Account.create({
            email: 'test@example.com',
            name: 'Test User',
            age: 30
        });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('POST /conversion/create', () => {
        it('should create a new conversion', async () => {
            const res = await request(app)
                .post('/conversion/create')
                .send({
                    name: 'Test Conversion',
                    userId: testUser._id
                })
                .expect(200);

            expect(res.body.conversion).to.have.property('name', 'Test Conversion');
            expect(res.body.conversion).to.have.property('userId');
            expect(res.body.conversion).to.have.property('countByDate');

            const conversions = await Conversion.find({ userId: testUser._id });
            expect(conversions).to.have.lengthOf(1);
            expect(conversions[0].name).to.equal('Test Conversion');
        });

        it('should not create two conversions with the same name for the same user', async () => {
            await Conversion.create({
                name: 'Duplicate Conversion',
                userId: testUser._id,
                countByDate: {}
            });

            const res = await request(app)
                .post('/conversion/create')
                .send({
                    name: 'Duplicate Conversion',
                    userId: testUser._id
                })
                .expect(500);

            expect(res.body).to.have.property('error');
        });

        it('should allow same conversion name for different users', async () => {
            const user2 = await Account.create({
                email: 'user2@example.com',
                name: 'User 2',
                age: 25
            });

            await request(app)
                .post('/conversion/create')
                .send({
                    name: 'Same Name',
                    userId: testUser._id
                })
                .expect(200);

            const res = await request(app)
                .post('/conversion/create')
                .send({
                    name: 'Same Name',
                    userId: user2._id
                })
                .expect(200);

            expect(res.body.conversion).to.have.property('name', 'Same Name');
        });
    });

    describe('GET /conversion/fetch', () => {
        it('should fetch all conversions for a user', async () => {
            await Conversion.create([
                { name: 'Conversion 1', userId: testUser._id, countByDate: {} },
                { name: 'Conversion 2', userId: testUser._id, countByDate: {} }
            ]);

            const res = await request(app)
                .get(`/conversion/fetch?userId=${testUser._id}`)
                .expect(200);

            expect(res.body.conversions).to.have.lengthOf(2);
        });

        it('should return empty array if user has no conversions', async () => {
            const res = await request(app)
                .get(`/conversion/fetch?userId=${testUser._id}`)
                .expect(200);

            expect(res.body.conversions).to.have.lengthOf(0);
        });
    });

    describe('POST /conversion/count', () => {
        it('should increment conversion count for today', async () => {
            const conversion = await Conversion.create({
                name: 'Count Test',
                userId: testUser._id,
                countByDate: {}
            });

            const res = await request(app)
                .post('/conversion/count')
                .send({
                    name: 'Count Test',
                    userId: testUser._id
                })
                .expect(200);

            expect(res.body.conversion.countByDate).to.be.an('object');
            const today = new Date().toISOString().split('T')[0];
            expect(res.body.conversion.countByDate[today]).to.equal(1);
        });

        it('should increment existing count', async () => {
            const today = new Date().toISOString().split('T')[0];
            await Conversion.create({
                name: 'Count Test',
                userId: testUser._id,
                countByDate: { [today]: 5 }
            });

            const res = await request(app)
                .post('/conversion/count')
                .send({
                    name: 'Count Test',
                    userId: testUser._id
                })
                .expect(200);

            expect(res.body.conversion.countByDate[today]).to.equal(6);
        });

        it('should return 404 if conversion not found', async () => {
            const res = await request(app)
                .post('/conversion/count')
                .send({
                    name: 'Nonexistent',
                    userId: testUser._id
                })
                .expect(404);

            expect(res.body).to.have.property('error', 'conversion not found');
        });
    });

    describe('GET /conversion/total-by-date', () => {
        it('should return total conversions in date range', async () => {
            await Conversion.create({
                name: 'Test',
                userId: testUser._id,
                countByDate: {
                    '2024-01-01': 5,
                    '2024-01-02': 3,
                    '2024-01-03': 2,
                    '2024-01-10': 10
                }
            });

            const res = await request(app)
                .get(`/conversion/total-by-date?userId=${testUser._id}&startDate=2024-01-01&endDate=2024-01-03`)
                .expect(200);

            expect(res.body.sum).to.equal(10); // 5 + 3 + 2
        });

        it('should include both start and end dates', async () => {
            await Conversion.create({
                name: 'Test',
                userId: testUser._id,
                countByDate: {
                    '2024-01-01': 1,
                    '2024-01-05': 1
                }
            });

            const res = await request(app)
                .get(`/conversion/total-by-date?userId=${testUser._id}&startDate=2024-01-01&endDate=2024-01-05`)
                .expect(200);

            expect(res.body.sum).to.equal(2);
        });

        it('should sum across multiple conversions', async () => {
            await Conversion.create([
                {
                    name: 'Conv 1',
                    userId: testUser._id,
                    countByDate: { '2024-01-02': 5 }
                },
                {
                    name: 'Conv 2',
                    userId: testUser._id,
                    countByDate: { '2024-01-02': 3 }
                }
            ]);

            const res = await request(app)
                .get(`/conversion/total-by-date?userId=${testUser._id}&startDate=2024-01-01&endDate=2024-01-03`)
                .expect(200);

            expect(res.body.sum).to.equal(8);
        });

        it('should return 0 if no conversions in range', async () => {
            await Conversion.create({
                name: 'Test',
                userId: testUser._id,
                countByDate: { '2024-01-01': 5 }
            });

            const res = await request(app)
                .get(`/conversion/total-by-date?userId=${testUser._id}&startDate=2024-02-01&endDate=2024-02-05`)
                .expect(200);

            expect(res.body.sum).to.equal(0);
        });
    });
});
