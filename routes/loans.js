"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

//middlewares
const auth_admin_checker = require("../middlewares/auth_admin_checker");

router.post("/create", auth_admin_checker, loans.addLoan);
router.get("/loans", auth_admin_checker, loans.getLoans);
router.get("/:id", auth_admin_checker, loans.getOneLoan);
router.put("/update-status/:id", auth_admin_checker, loans.updateLoanStatus);

module.exports = router;
