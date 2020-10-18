var moment = require('moment');
const ConversionService = require('../../services/conversionService');

module.exports = async function(req, res, next) {
	const {userId, startDate, endDate} = req.query;
    const conversionService = new ConversionService();
    conversionService.getConversions(userId)
    .then(resp => { 
        let sum = 0;
        resp.forEach(item => {
            Object.keys(item.countByDate).forEach(key => {
                if(moment(key).isBetween(moment(startDate),moment(endDate)))
                    sum += item.countByDate[key];
            });
        });
        res.send({sum});
    })
	.catch(error => res.json({error}).status(500));
};