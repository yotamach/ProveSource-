const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	const userId = req.query.userId;
	const conversionService = new ConversionService();
	conversionService.getConversions(userId)
	.then(resp => { 
		res.send({conversions: resp});
    })
	.catch(error => res.json({error}).status(500));
};