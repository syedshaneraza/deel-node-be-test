const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const jobController = require("../controllers/job.controller");

router.get("/unpaid", getProfile, jobController.getUnpaidJobs);
router.post("/:job_id/pay", getProfile, jobController.payForJob);

module.exports = router;
