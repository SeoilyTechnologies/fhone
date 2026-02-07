const User = require("../models/user");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const sendOtpEmail = require("../utils/sendOtpEmail");
const sendOtpSms = require("../utils/sendOtpSms");
const generateToken = require("../middleware/generateToken");

const REVIEW_TEST_PHONE = "8699105363";
const REVIEW_TEST_OTP = "123456";

/* =====================================================
   EMAIL REGISTER
===================================================== */
exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      date_of_birth,
      gender,
      language,
      latitude,
      longitude,
      location,
      isNotificationAllowed,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user = await User.findOne({ email });

    // ================= NEW USER =================
    if (!user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user = new User({
        email,
        username: username || "",
        date_of_birth: date_of_birth || "",
        gender: gender || "",
        language: language || "en",
        latitude: latitude || "",
        longitude: longitude || "",
        location: location || "",
        isNotificationAllowed: isNotificationAllowed ?? true,

        password: CryptoJs.AES.encrypt(
          password,
          process.env.PASSWORD_SEC
        ).toString(),

        account_type: "email",

        otp,
        otpExpires: Date.now() + 60 * 1000, // 1 min
        isVerified: false,

        isProfileComplete:
          !!username && !!date_of_birth && !!gender && !!location,
      });

      await user.save();
      await sendOtpEmail(email, otp);

      return res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    }

    // ================= EXISTING BUT NOT VERIFIED =================
    if (!user.isVerified) {
      if (user.otpExpires && user.otpExpires > Date.now()) {
        return res.status(200).json({
          success: true,
          message: "OTP already sent",
        });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = newOtp;
      user.otpExpires = Date.now() + 60 * 1000;
      await user.save();
      await sendOtpEmail(email, newOtp);

      return res.status(200).json({
        success: true,
        message: "New OTP sent",
      });
    }

    // ================= VERIFIED USER =================
    return res.status(400).json({
      success: false,
      message: "User already registered. Please login.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   VERIFY EMAIL OTP
===================================================== */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    const token = generateToken(updated);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: updated,
      isProfileComplete: updated.isProfileComplete,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   EMAIL LOGIN
===================================================== */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        message: "Please verify your account",
      });

    const decrypted = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    ).toString(CryptoJs.enc.Utf8);

    if (decrypted !== password)
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    const token = generateToken(updated);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: updated,
      isProfileComplete: updated.isProfileComplete,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   SEND PHONE OTP
===================================================== */
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({
        success: false,
        message: "Phone number required",
      });

    let user = await User.findOne({ phone });

    const otp =
      phone === REVIEW_TEST_PHONE
        ? REVIEW_TEST_OTP
        : Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = Date.now() + 10 * 60 * 1000;

    if (!user) {
      user = new User({
        phone,
        account_type: "phone",
        phoneOtp: otp,
        phoneOtpExpires: expiry,
        isPhoneVerified: false,
        isProfileComplete: false,
      });
    } else {
      user.phoneOtp = otp;
      user.phoneOtpExpires = expiry;
    }

    await user.save();

    if (phone !== REVIEW_TEST_PHONE) {
      await sendOtpSms(phone, otp);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Send phone OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};

/* =====================================================
   VERIFY PHONE OTP
===================================================== */
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.phoneOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.phoneOtpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.isPhoneVerified = true;
    user.isVerified = true;
    user.phoneOtp = null;
    user.phoneOtpExpires = null;

    await user.save();

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    const token = generateToken(updated);

    return res.status(200).json({
      success: true,
      message: "Phone verified",
      token,
      user: updated,
      isProfileComplete: updated.isProfileComplete,
    });
  } catch (err) {
    console.error("Verify phone OTP error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   FORGOT PASSWORD
===================================================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        message: "Account not verified",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.forgotOtp = otp;
    user.forgotOtpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.forgotOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.forgotOtpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.password = CryptoJs.AES.encrypt(
      newPassword,
      process.env.PASSWORD_SEC
    ).toString();

    user.forgotOtp = null;
    user.forgotOtpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   DELETE ACCOUNT
===================================================== */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.forgotOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.forgotOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Now reset your password.",
    });

  } catch (err) {
    console.error("Verify forgot OTP error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
