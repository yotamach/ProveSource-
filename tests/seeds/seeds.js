  
const {ObjectID} = require('mongodb');

const accountOneId = new ObjectID();
const accountTwoId = new ObjectID();
const accounts = [{
  _id: accountOneId,
  email: 'yotam@example.com',
  name: 'Yotam',
  age: 35
}, {
  _id: accountTwoId,
  email: 'hen@example.com',
  name: 'Hen',
  age: 25
}];

const conversions = [{
  _id: new ObjectID(),
  name: 'First test conversion',
  countByDate: {'2020-10-19': 5},
  userId: accountOneId
}, {
  _id: new ObjectID(),
  name: 'Second test conversion',
  countByDate: {},
  userId: accountTwoId
}];

const populateConversions = (done) => {
    Conversion.remove({}).then(() => {
        Conversion.insertMany(conversions);
  }).then(() => done());
};

const populateAccounts = (done) => {
    Account.remove({}).then(() => {
    var accountOne = new Account(accounts[0]).save();
    var accountTwo = new Account(accounts[1]).save();

    return Promise.all([accountOne, accountTwo])
  }).then(() => done());
};