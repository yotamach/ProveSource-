const Account = require('../models/account/Account');

module.exports = class AccountService {
  constructor() {}

  getAccounts(cb) {
     Account.find({},cb);
  }

  createAccount(email,name,age) {
    const account = new Account({email, name, age});
    return account.save();
  }
}