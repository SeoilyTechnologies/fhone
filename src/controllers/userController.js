// controllers/userController.js

const User = require("../models/user");
const CryptoJs = require("crypto-js");

// ✅ Helper: current request se token nikaal lo (Bearer <token>)
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// ✅ GET /api/user/profile  — get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken se aaya

    const user = await User.findById(userId).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const token = getTokenFromRequest(req);

    // login jaisa response
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      token: token,       // jo already client ke पास है, बस वापस भेज रहे हैं
      user: user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ✅ POST /api/user/updateprofile — update user profile
// ✅ POST /api/user/updateprofile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ User check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 2️⃣ Verification check (EMAIL vs PHONE)
    if (
      (user.account_type === "email" && !user.isVerified) ||
      (user.account_type === "phone" && !user.isPhoneVerified)
    ) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    // 3️⃣ ❌ PROTECTED FIELDS (ignore from client)
    delete req.body.email;
    delete req.body.account_type;
    delete req.body.socialProvider;
    delete req.body.socialId;
    delete req.body.isProfileComplete;
    delete req.body.isVerified;
    delete req.body.tokenVersion;
    delete req.body.isPhoneVerified;

    // 4️⃣ Password update (if provided)
    if (req.body.password) {
      req.body.password = CryptoJs.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SEC
      ).toString();
    }

    // 5️⃣ Profile image (multer / s3)
    if (req.file && req.file.key) {
      req.body.profile_image = req.file.key;
    }

    // 6️⃣ Update user basic fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    // 7️⃣ 🔥 PROFILE COMPLETION LOGIC (SERVER DECIDES)
    const isProfileComplete =
      !!updatedUser.username &&
      !!updatedUser.date_of_birth &&
      !!updatedUser.gender;

    // 8️⃣ Update isProfileComplete ONLY if changed
    if (updatedUser.isProfileComplete !== isProfileComplete) {
      updatedUser.isProfileComplete = isProfileComplete;
      await updatedUser.save();
    }

    // 9️⃣ Remove sensitive fields
    const safeUser = updatedUser.toObject();
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpires;
    delete safeUser.forgotOtp;
    delete safeUser.forgotOtpExpires;
    delete safeUser.phoneOtp;
    delete safeUser.phoneOtpExpires;
 const token = getTokenFromRequest(req);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser,
        token: token,       // jo already client ke पास है, बस वापस भेज रहे हैं
      isProfileComplete: updatedUser.isProfileComplete,
    });

  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
