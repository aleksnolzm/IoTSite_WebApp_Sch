const mongoose = require('mongoose');
const { Schema } = mongoose;

const callbackSchema = new Schema({
    siteRH: Number,
    siteTemp: Number,
    txTemp: Number, 
    generalStatus: Number,
    estadoPuerta: String,
    estadoEnergia: String,
    fecha: Date
});

module.exports = mongoose.model('callbacks', callbackSchema);

