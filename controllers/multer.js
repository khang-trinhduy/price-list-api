var multer = require("multer");
var cryptoRandomString = require("crypto-random-string");

var randomString = () => {
  return cryptoRandomString({ length: 5 });
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${randomString()}-${file.originalname}`);
  }
});

var allowedFileType = str => {
  str = str.toLowerCase();
  return str.endsWith("jpg") || str.endsWith("jpeg") || str.endsWith("png");
};

var onFileUploadStart = file => {
  console.log(file.originalname + " is starting ...");
};

var onFileUploadCOmplete = file => {
  console.log(file.fieldname + "uploaded to " + file.path);
};

var maxFileSize = 1000000;

var filter = (req, file, cb) => {
  if (!allowedFileType(file.mimetype)) {
    cb(`file's type is not allowed: ${file.mimetype}`, false);
  } else {
    cb(null, true);
  }
};

var limits = {
  files: 1,
  fileSize: maxFileSize
};

exports.upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: filter
}).single("image");

exports.error = multer.MulterError;
