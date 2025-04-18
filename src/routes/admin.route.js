const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/best-profession", adminController.getBestProfession);
router.get("/best-clients", adminController.getBestClients);

module.exports = router;
