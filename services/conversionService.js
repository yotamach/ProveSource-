const moment = require('moment');
const Conversion = require('../models/conversion/Conversion');

module.exports = class ConversionService {
    constructor(){}
  
    getConversions(userId) {
        return Conversion.find({userId});
    }
 
    async createConversion(name, userId) {
        const conversion = new Conversion({
            name,
            userId,
            countByDate: {}
        });
        return conversion.save();
    }

    countConversion(name, userId) {
        return Conversion.findOne({
            userId,
            name
        });
    }

    updateConversion(conversionToUpdate) {
        return Conversion.findByIdAndUpdate(
            conversionToUpdate._id,
            { countByDate: conversionToUpdate.countByDate },
            { new: true }
        );
    }
}