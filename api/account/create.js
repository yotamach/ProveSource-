const AccountService = require('../../services/accountService');

module.exports = async function(req, res, next) {
	try {
		const accountService = new AccountService();
		const {email, name, age} = req.body;
		const user = await accountService.createAccount(email, name, age);
		return res.send({user});
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
};