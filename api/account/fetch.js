const AccountService = require('../../services/accountService');

module.exports = async function(req, res, next) {
	try {
		const accountService = new AccountService();
		const users = await accountService.getAccounts();
		return res.send({users});
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
};