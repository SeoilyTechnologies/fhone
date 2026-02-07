const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = require("./s3.config");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: "public-read", // 👈 public URL
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
