const { prices } = require("../models/price");
const { provinces } = require("../models/province");
const { cars } = require("../models/car");
var multer = require("./multer");

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

exports.list = (req, res, next) => {
  prices.find({}, (error, prices) => {
    if (error) {
      sendJsonResponse(res, 400, error);
    } else {
      if (prices && prices.length > 5) {
        let reverse = prices.reverse();
        sendJsonResponse(res, 200, reverse.slice(0, 5));
      } else {
        sendJsonResponse(res, 200, prices);

      }
    }
  });
};

exports.show = (req, res, next) => {
  if (!req.params.id) {
    sendJsonResponse(res, 400, { error: "id required" });
  } else {
    prices.findById(req.params.id, (error, price) => {
      if (error) {
        sendJsonResponse(res, 400, error);
      } else if (!price) {
        sendJsonResponse(
          res,
          404,
          `cannot find price with id ${req.params.id}`
        );
      } else {
        sendJsonResponse(res, 200, price);
      }
    });
  }
};

exports.upload = (req, res, next) => {
  // input: images, req.params.id, body: final, insurance, gift, type
  multer.upload(req, res, err => {
    if (err instanceof multer.error) {
      sendJsonResponse(res, 400, { message: "multer error", error: err });
    } else if (err) {
      sendJsonResponse(res, 400, { message: "server error", error: err });
    } else {
      sendJsonResponse(res, 201, { file: req.file, message: "file uploaded" });
    }
  });
};

exports.update = (req, res, next) => {
  if (!req.params.id) {
    sendJsonResponse(res, 400, { error: "id required" });
  } else {
    prices.findById(req.params.id, (error, price) => {
      if (error) {
        sendJsonResponse(res, 400, error);
      } else if (!price) {
        sendJsonResponse(res, 404, {
          error: `cannot find price with id ${req.params.id}`
        });
      } else {
        if (!req.body.final || !req.body.image) {
          sendJsonResponse(res, 400, {
            error: `final and image are required`
          });
        } else {
          price.total = req.body.final;
          price.insurance = req.body.insurance || false;
          price.gift = req.body.gift || 0;
          price.img = req.body.image;
          price.benefit = req.body.benefit || 0;
          price.save((err, result) => {
            if (err) {
              sendJsonResponse(res, 400, err);
            } else {
              sendJsonResponse(res, 200, result);
            }
          });
        }
      }
    });
  }
};

exports.create = (req, res, next) => {
  if (!req.body.province || !req.body.car || !req.body.model) {
    sendJsonResponse(res, 400, `province, car, and model are required`);
  } else {
    provinces.findOne({ name: req.body.province }, (err, province) => {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else if (!province) {
        sendJsonResponse(
          res,
          404,
          `province with name ${req.body.province} not found`
        );
      } else {
        let license = province.licenseFee;
        let prepaidFee = province.prepaidFee;
        console.log(province);

        cars.findOne(
          {
            name: req.body.car,
            version: req.body.model,
            color: req.body.color
          },
          (error, car) => {
            if (error) {
              sendJsonResponse(res, 400, error);
            } else if (!car) {
              sendJsonResponse(
                res,
                404,
                `can not find any car match name: ${req.body.car}, model: ${req.body.model} and color: ${req.body.color}`
              );
            } else {
              let price = car.price;
              let prepaid = (price / 100) * prepaidFee;
              let carInsurPercent = 1.5;
              if (car.name === "FADIL") {
                carInsurPercent = 1.6;
                if (car.version === "luxury") {
                  carInsurPercent = 1.7;
                }
              }
              let carInsurance = (price / 100) * carInsurPercent;
              let transitFee = 1560000;
              let publicFee = 550000;
              let registrationFee = 3500000;
              let registryFee = 340000;
              let total =
                price +
                prepaid +
                license +
                transitFee +
                publicFee +
                registrationFee +
                registryFee;
              //  +
              // carInsurance;
              let pricelist = {
                contact: req.body.contact,
                price: price,
                prepaidFee: prepaid,
                licenseFee: license,
                carInsuranceFee: carInsurance,
                total: total,
                carId: car._id,
                carName: car.name,
                carType: car.version,
                province: province.name
              };
              prices.create(pricelist, (er, result) => {
                if (er) {
                  sendJsonResponse(res, 400, er);
                } else {
                  sendJsonResponse(res, 201, result);
                }
              });
            }
          }
        );
      }
    });
  }
};
