const moment = require('moment');
const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	try {
		const {name, userId} = req.body;
		const conversionService = new ConversionService();
		const conversion = await conversionService.countConversion(name, userId);
		
		if (!conversion) {
			return res.status(404).json({error: "conversion not found"});
		}
		
		const today = moment().format("YYYY-MM-DD");
		conversion.countByDate[today] = (conversion.countByDate[today] || 0) + 1;
		
		const updatedConversion = await conversionService.updateConversion(conversion);
		return res.send({conversion: updatedConversion});
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};