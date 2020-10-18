var moment = require('moment');
const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	const {name, userId} = req.body;
	const conversionService = new ConversionService();
	conversionService.countConversion(name, userId,(error, resp) =>
	{
		if(error)
			return res.send({error: "conversion not found"});
		resp.countByDate.hasOwnProperty(moment().format("YYYY-MM-DD")) ? resp.countByDate[moment().format("YYYY-MM-DD")]++ : resp.countByDate[moment().format("YYYY-MM-DD")] = 1;
		conversionService.updateConversion(resp)
		.then(resp => res.send({conversion: resp}))
		.catch(error => res.send({error:' "conversion save was failed'}));
	});
};