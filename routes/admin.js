"use strict";

const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");

router.route("/create").post(admin.addLoan);
router.route("/").get(admin.getLoans);
router.route("/:id").get(admin.getOneLoan);
router.route("/loan/update/:id").put(admin.updateLoanStatus);

module.exports = router;
