const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../app');
const {accounts, populateAccounts, conversions, populateConversions} = require('./seeds/seeds');

beforeEach(populateAccounts);
beforeEach(populateConversions);

describe('POST /account/create', () => {
  it('should create a new account', (done) => {
    var text = 'Test account text';

    request(app)
      .post('/account/create')
      .send({name: text, age: 54, email: "yotam@getMax.com"})
      .expect(200)
      .expect((res) => {
        expect(res.body.user.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Account.find({name}).then((accounts) => {
          expect(accounts.length).toBe(1);
          expect(accounts[0].name).toBe(name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create account with invalid body data', (done) => {
    request(app)
      .post('/account/create')
      .send({})
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Account.find().then((accounts) => {
          expect(accounts.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /account/fetch', () => {
  it('should get all accounts', (done) => {
    request(app)
      .get('/account/fetch')
      .expect(200)
      .expect((res) => {
        expect(res.body.users.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /conversion/create', () => {
    it('should create a new conversion', (done) => {
        var text = 'Test conversion text';
    
        request(app)
          .post('/conversion/create')
          .send({name: text, userId: accounts[0]._id})
          .expect(200)
          .expect((res) => {
            expect(res.body.conversion.name).toBe(name);
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
    
            Conversion.find({name}).then((conversions) => {
              expect(conversions.length).toBe(1);
              expect(conversions[0].name).toBe(name);
              done();
            }).catch((e) => done(e));
          });
      });
});