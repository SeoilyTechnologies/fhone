const express = require("express");
console.log("🔥 MyGatePlan Route Loaded");

const router = express.Router();
const controller = require("../controllers/mygatePlan.controller");
console.log("🔥ss MyGatePlan Route Loaded");

router.post("/get-plan-by-id", controller.getPlanByUserId);
router.post("/save-plan", controller.savePlan);

module.exports = router;
