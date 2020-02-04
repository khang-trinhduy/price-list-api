var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var carSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: false },
  version: { type: String, required: true, default: "standard" }
});

module.exports.cars = mongoose.model("cars", carSchema);

module.exports.car_schema = carSchema;
