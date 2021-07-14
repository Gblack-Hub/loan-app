"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

router.post("/create", loans.addLoan);
router.get("/loans", loans.getLoans);
router.get("/:id", loans.getOneLoan);
router.put("/update/:id", loans.updateLoanStatus);
router.post("/repay/:id", loans.repayLoan);

module.exports = router;
