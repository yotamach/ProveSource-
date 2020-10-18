const AccountService = require('../../services/accountService');

module.exports = async function(req, res, next) {
	const accountService = new AccountService();
	const {email, name, age} = req.body;
	accountService.createAccount(email, name, age)
	.then(resp => res.send({user: resp}))
	.catch(err => res.status(500).json({error: err}));
	
};