const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	const {name, userId} = req.body;
	const conversionService = new ConversionService();
	conversionService.createConversion(name, userId)
	.then(resp => res.send({conversion: resp}))
	.catch(error => res.json({error}).status(500));
};