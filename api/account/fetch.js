const AccountService = require('../../services/accountService');

module.exports = async function(req, res, next) {
	const accountService = new AccountService();
	accountService.getAccounts((err, users) => {
		if(err)
			return res.send({error: err}).status(500);
		return res.send({users});
	 });
};