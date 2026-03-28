const moment = require('moment');
const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	try {
		const {userId, startDate, endDate} = req.query;
		const conversionService = new ConversionService();
		const conversions = await conversionService.getConversions(userId);
		
		let sum = 0;
		conversions.forEach(item => {
			Object.keys(item.countByDate).forEach(key => {
				if(moment(key).isBetween(moment(startDate), moment(endDate), null, '[]')) {
					sum += item.countByDate[key];
				}
			});
		});
		
		return res.send({sum});
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};