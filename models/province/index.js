var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var provinceSchema = new Schema({
  name: { type: String, required: true },
  prepaidFee: { type: Number, required: true },
  registryFee: { type: Number, required: true, default: 1000000 }
});

module.exports.provinces = mongoose.model("provinces", provinceSchema);

module.exports.province_schema = provinceSchema;
