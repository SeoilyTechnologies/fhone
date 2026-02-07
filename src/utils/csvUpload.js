const multer = require("multer");

const csvUpload = multer({
  storage: multer.memoryStorage()
});

module.exports = csvUpload;
