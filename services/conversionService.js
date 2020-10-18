var moment = require('moment');
const Conversion = require('../models/conversion/Conversion');

module.exports = class ConversionService {
    constructor(){}
  
  getConversions(userId) {
      return Conversion.find({userId},(resp) => console.log(resp));
   }resp
 
   createConversion(name,userId) {
    const conversion = new Conversion({
      name,
      userId,
      countByDate: {[moment().format("YYYY-MM-DD")]: 1}
    });
    return conversion.save();
   }

   countConversion(name,userId,cb) {
    return Conversion.findOne({
      userId,
      name
    },cb);
   }

   updateConversion(conversionToUpdate) {
		const updatedConversion = new Conversion(conversionToUpdate);
		return updatedConversion.save();
   }
  }