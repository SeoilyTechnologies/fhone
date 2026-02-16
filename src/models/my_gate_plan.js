const mongoose = require("mongoose");

const mygatePlanSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // User collection se link
      required: true,
    //  unique: true,  // ek user ka ek hi plan hoga
    },

    phoneno: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
  type: String,
  default: "",
},

    plantype: {
      type: String,
      default: "free",
    },

    paymentid: {
      type: String,
    },

    paymentreference: {
      type: String,
    },

    planStartDate: {
      type: Date,
      default: Date.now,
    },

    planExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MyGatePlannew", mygatePlanSchema, "mygateplannews");
