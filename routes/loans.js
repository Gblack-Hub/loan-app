"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

router.route("/create").post(loans.addLoan);
router.route("/all").post(loans.getLoans);
router.route("/:id").get(loans.getOneLoan);

module.exports = router;
