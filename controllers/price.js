const { prices } = require("../models/price");

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

exports.list = (req, res, next) => {
  prices.find({}, (error, prices) => {
    if (error) {
      sendJsonResponse(res, 400, error);
    } else {
      sendJsonResponse(res, 200, prices);
    }
  });
};
