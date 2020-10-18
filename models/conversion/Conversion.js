const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Conversion = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    countByDate: Object,
    userId: {type: Schema.Types.ObjectId, ref: 'Account'}
}, {timestamps: true});
    
Conversion.index({ name: 1, userId: 1}, { unique: true });

module.exports = mongoose.model('Conversion', Conversion);