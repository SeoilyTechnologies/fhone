const mongoose = require("mongoose");

const MyGatePlan = require("../models/my_gate_plan");

// ==========================
// 🔹 Get Plan By UserId
// ==========================
exports.getPlanByUserId = async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const objectUserId = new mongoose.Types.ObjectId(userid);

    // const plans = await MyGatePlan.find({ userid: objectUserId })
    //   .sort({ createdAt: -1 });
const plans = await MyGatePlan.find({ userid })
  .sort({ createdAt: -1 });

    console.log("Plans Found:", plans.length);

    return res.status(200).json({
      success: true,
      total: plans.length,
      data: plans,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================
// 🔹 Save / Update Plan API
// ==========================

exports.savePlan = async (req, res) => {
  try {
    const {
      paymentid,
      plantype,
      phoneno,
      userid,
      paymentreference,
    } = req.body;

    if (!userid || !phoneno || !plantype) {
      return res.status(400).json({
        success: false,
        message: "userid, phoneno and plantype are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // 🔹 Create new plan
    const newPlan = await MyGatePlan.create({
      userid,
      phoneno,
      plantype,
      paymentid,
      paymentreference,
    });

    return res.status(201).json({
      success: true,
      message: "Plan purchased successfully",
      data: newPlan, // ✅ only one object
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



