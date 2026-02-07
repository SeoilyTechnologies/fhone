

const router = require("express").Router();
//const upload = require("../utils/multer");
const upload = require("../utils/s3Upload");
const verifyToken = require("../middleware/verifyToken");

const {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword, resetPassword,verifyForgotOtp, sendPhoneOtp, verifyPhoneOtp,deleteAccount
} = require("../controllers/authController");
console.log("verifyToken type:", typeof verifyToken);
console.log("deleteAccount type:", typeof deleteAccount);
// REGISTER
router.post("/register", upload.single("profile_image"), registerUser);


// VERIFY OTP
router.post("/verify-otp", verifyOtp);

// LOGIN
router.post("/login", loginUser);


//forget password
router.post("/forgot-password", forgotPassword);

// VERIFY OTP
router.post("/verify-forget-otp", verifyForgotOtp);

//reset password
router.post("/reset-password", resetPassword);


router.post("/phone/send-otp", sendPhoneOtp);

router.post("/phone/verify-otp", verifyPhoneOtp);

router.post("/delete-account", verifyToken, deleteAccount);

//router.post("/phone/quick-register", phoneQuickRegister);

module.exports = router;
