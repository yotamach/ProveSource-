const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	try {
		const {name, userId} = req.body;
		const conversionService = new ConversionService();
		const conversion = await conversionService.createConversion(name, userId);
		return res.send({conversion});
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};