const mongoose = require("mongoose");

const { prices } = require("../models/price");
const { cars } = require("../models/car");
const { car_seed } = require("../models/car/seed");
const { provinces } = require("../models/province");
const { province_seed } = require("../models/province/seed");
// const {prices} = require('../models/price')

var dbURI = "mongodb://localhost/pricelist";

if (process.env.NODE_ENV === "production") {
  dbURI = "mongodb://admin:admin1@ds041198.mlab.com:41198/heroku_7w6cx7n4";
}

mongoose.connect(dbURI, { useNewUrlParser: true });

var db = mongoose.Connection;

var readLine = require("readline");
if (process.platform === "win32") {
  var rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

mongoose.connection.on("connected", function() {
  console.log("Mongoose connected to " + dbURI);

  cars.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      if (!result || result.length <= 1) {
        cars.insertMany(car_seed);
      }
    }
  });

  provinces.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      if (!result || result.length <= 1) {
        provinces.insertMany(province_seed);
      }
    }
  });
});
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose disconnected");
});
mongoose.connection.on("error", function() {
  console.log("Mongoose connection error");
});

var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};

process.once("SIGUSR2", function() {
  gracefulShutdown("nodemon restart", function() {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", function() {
  gracefulShutdown("app termination", function() {
    process.exit(0);
  });
});

process.on("SIGTERM", function() {
  gracefulShutdown("Heroku app shutdown", function() {
    process.exit(0);
  });
});
