const { provinces } = require("../models/province");

var sendJsonResnponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

exports.list = (req, res, next) => {
  provinces.find({}, (error, result) => {
    if (error) {
      sendJsonResnponse(res, 400, error);
    } else {
      sendJsonResnponse(res, 200, result);
    }
  });
};

exports.show = (req, res, next) => {
  if (!req.params.id) {
    sendJsonResnponse(res, 400, { error: "province id required" });
  } else {
    provinces.findById(req.params.id, (error, province) => {
      if (error) {
        sendJsonResnponse(res, 400, error);
      } else if (!province) {
        sendJsonResnponse(res, 404, {
          error: `province with id ${req.params.id} not found`
        });
      } else {
        sendJsonResnponse(res, 200, province);
      }
    });
  }
};
