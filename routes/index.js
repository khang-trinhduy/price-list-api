var express = require("express");
var router = express.Router();
var priceCtrl = require("../controllers/price");
var carCtrl = require("../controllers/car");
var provinceCtrl = require("../controllers/province");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// price controller
router.get("/prices", priceCtrl.list);

// car controller
router.get("/cars", carCtrl.list);
router.get("/cars/:id", carCtrl.show);

// province controller
router.get("/provinces", provinceCtrl.list);
router.get("/provinces/:id", provinceCtrl.show);

module.exports = router;
