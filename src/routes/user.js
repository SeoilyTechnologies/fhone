// routes/userRoutes.js (ya jo bhi file hai abhi)

const router = require("express").Router();
const upload = require("../utils/s3Upload");
const verifyToken = require("../middleware/verifyToken");

const { getProfile, updateProfile } = require("../controllers/userController");

// GET /api/user/profile
router.get("/profile", verifyToken, getProfile);

// POST /api/user/updateprofile
router.post(
  "/updateprofile",
  verifyToken,
  upload.single("profile_image"), // agar tum field ka naam different rakhoge to yaha change karo
  updateProfile
);

module.exports = router;
