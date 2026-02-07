const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    username: {
      type: String,
      trim: true,
      default: "",
    },

  email: {
  type: String,
  unique: true,
  sparse: true,
  lowercase: true,
  trim: true,
  match: [/.+@.+\..+/, "Please enter a valid email address"],
},


  phone: {
  type: String,
  unique: true,
  sparse: true,
},

    password: {
      type: String,
      minlength: 6,
      trim: true,
      default: null,
    },

    profile_image: {
      type: String,
      default: "",
    },

    date_of_birth: {
      type: String,
      default: "",
    },
birth_time: {
  type: String,
  default: "",
},

state: {
  type: String,
  default: "",
},
city: {
  type: String,
  default: "",
},

area: {
  type: String,
  default: "",
},

houseno: {
  type: String,
  default: "",
},
flatno: {
  type: String,
  default: "",
},


    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    language: {
      type: String,
      enum: ["en", "hi", "pa"],
      default: "en",
    },

    // ================= LOCATION =================
    location: {
      type: String,
      default: "",
    },

    latitude: {
      type: String,
      default: "",
    },

    longitude: {
      type: String,
      default: "",
    },

    // ================= ACCOUNT TYPE =================
    account_type: {
      type: String,
      enum: ["email", "phone", "google", "facebook", "apple"],
      default: "phone", // since app uses phone login
    },

    // ================= VERIFICATION FLAGS =================
    isVerified: {
      type: Boolean,
      default: false, // email verification
    },

    isPhoneVerified: {
      type: Boolean,
      default: false, // phone verification
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isNotificationAllowed: {
      type: Boolean,
      default: true,
    },

    // ================= OTP (EMAIL) =================
    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    // ================= OTP (PHONE) =================
    phoneOtp: {
      type: String,
      default: null,
    },

    phoneOtpExpires: {
      type: Date,
      default: null,
    },

    // ================= FORGOT PASSWORD =================
    forgotOtp: {
      type: String,
      default: null,
    },

    forgotOtpExpires: {
      type: Date,
      default: null,
    },

   

    // ================= SECURITY =================
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
