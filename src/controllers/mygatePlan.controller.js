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

    // ✅ Correct search
    const plan = await MyGatePlan.findOne({ userid });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plan,
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

    // ✅ Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // 🔎 Find existing plan by userid (NOT findById)
    let plan = await MyGatePlan.findOne({ userid });

    if (!plan) {
      // 🆕 Create new plan
      plan = await MyGatePlan.create({
        userid,
        phoneno,
        plantype,
        paymentid,
        paymentreference,
      });

      return res.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: plan,
      });
    }

    // 🔄 Update existing plan
    plan.plantype = plantype;
    plan.phoneno = phoneno;
    plan.paymentid = paymentid;
    plan.paymentreference = paymentreference;

    await plan.save();

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

