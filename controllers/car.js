const { cars } = require("../models/car");

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

exports.list = (req, res, next) => {
  cars.find({}, (error, result) => {
    if (error) {
      sendJsonResponse(res, 400, error);
    } else {
      sendJsonResponse(res, 200, result);
    }
  });
};

exports.show = (req, res, next) => {
  if (!req.params.id) {
    sendJsonResponse(res, 400, { message: "car id required" });
  } else {
    cars.findById(req.params.id, (error, car) => {
      if (error) {
        sendJsonResponse(res, 400, error);
      } else if (!car) {
        sendJsonResponse(res, 404, {
          error: `car with id ${req.params.id} not found`
        });
      } else {
        sendJsonResponse(res, 200, car);
      }
    });
  }
};
