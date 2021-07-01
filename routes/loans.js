"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

router.route("/create").post(loans.addLoan);
router.route("/").get(loans.getLoans);
router.route('/:id').get(loans.getOneLoan);
router.route('/update/:id').put(loans.updateLoan);
router.route('/delete/:id').delete(loans.deleteLoan);

module.exports = router;
