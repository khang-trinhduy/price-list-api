const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var priceSchema = new Schema({
  total: { type: Number, required: true },
  contact: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  prepaidFee: { type: Number, required: true },
  licenseFee: { type: Number, required: true, default: 1000000 },
  registryFee: { type: Number, required: true, default: 340000 },
  transitInsuranceFee: { type: Number, required: true, default: 1560000 },
  publicInsuranceFee: { type: Number, required: true, default: 550000 },
  carInsuranceFee: { type: Number, required: true },
  carRetristrationFee: { type: Number, required: true, default: 3500000 }
});

mongoose.model("prices", priceSchema);

module.exports.prices = mongoose.model("prices", priceSchema);

module.exports.price_schema = priceSchema;
