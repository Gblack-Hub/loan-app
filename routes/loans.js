"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

router.route("/create").post(loans.addLoan);
router.route("/all").get(loans.getLoans);
router.route("/:id").get(loans.getOneLoan);
router.route("/:id").put(loans.updateLoan);

module.exports = router;
