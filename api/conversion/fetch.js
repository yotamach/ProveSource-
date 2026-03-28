const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	try {
		const userId = req.query.userId;
		const conversionService = new ConversionService();
		const conversions = await conversionService.getConversions(userId);
		return res.send({conversions});
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};